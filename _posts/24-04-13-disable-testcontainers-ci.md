---
layout: post
title: Disable Testcontainers in Spring Boot when running in CI / CD Pipeline
date: 2024-04-13 09:00:00 +01:00
tags: testcontainers kotlin springboot cicd pipeline
category: blog
---

[Testcontainers](https://testcontainers.com/) is a great tool for local development and testing in order to spin up containers that mimick the actual environment to test against. It has frameworks for almost every programming language for easy to use integration.  
Sadly, it uses Docker under the hood and [does not want to support other container runtimes](https://github.com/testcontainers/testcontainers-java/issues/1135#issuecomment-453757407) like kubernetes. Since many GitLab Runners are hosted inside a Kubernetes cluster or do not want to expose the Docker socket for security reasons, testcontainers does not work anymore and tests fail in the pipeline.  
You [cannot disable testcontainers when docker is not present](https://github.com/testcontainers/testcontainers-java/issues/2833) because it will disable the whole test and not just the container initialization.  
Thats when a real engineer is needed and ChatGPT has to stay at home...

# JDBC

How to migrate if you are using the [JDBC](https://java.testcontainers.org/modules/databases/jdbc/) integration. You might have an `application-local.yaml` that looks like this:
```yaml
spring:
  flyway.enabled: true
  datasource:
    url: "jdbc:tc:postgresql:13.8:///testing"
    username: "testing"
    password: "testing"
```

First we need to create another profile that is not using the testcontainers integration. Create a file called `application-ci.yaml`:
```yaml
spring:
  flyway.enabled: true
  datasource:
    # postgres:5432 is the url to reach our new database
    url: "jdbc:postgresql://postgres:5432/testing"
    username: "testing"
    password: "testing"
```

Usually your tests look like this:
```kotlin
@DataJpaTest
// this activates the profile "test" for the current test
@ActiveProfiles("test")
class SomeTest() {}
```

The profile `test` is hardcoded here. Lets implement a resolver that changes the active profile based on an environment variable:
```kotlin
import org.springframework.test.context.ActiveProfilesResolver
class ProfileResolver : ActiveProfilesResolver {
    override fun resolve(testClass: Class<*>): Array<String> {
        val env: Map<String, String> = System.getenv()
        // read out the profile environment variable
        // use TC as default (local development)
        val profile: String = env.getOrDefault("PROFILE", "local")
        return arrayOf(profile)
    }
}
```

This function returns `local` if the `PROFILE` environment variable is not set. Otherwhise it returns the value of the variable.  
The resolver can be used like this:
```kotlin
@DataJpaTest
// instead of hard coding the profile we use a resolver here
@ActiveProfiles(resolver = ProfileResolver::class)
class SomeTest() {}
```

Set the variable in your CI definition. Example in GitLab CI:
```yaml
test:
  services:
    # use any container image
    - postgres:13.8
  variables:
    PROFILE: ci
  scripts:
    - ./gradlew test
```

# Testcontainers API

Sometimes you directly use the Testcontainers API inside the code to create containers and use them.  
Here is a basic example:
```kotlin
@SpringBootTest
@Testcontainers
@ActiveProfile("test")
class SomeIntegrationTest() {
    // your tests are here ...

    companion object {
        @Container
        @JvmStatic
        private val kafkaContainer =
            KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:7.4.0"))
                .withKraft()

        @DynamicPropertySource
        @JvmStatic
        @Suppress("unused")
        fun registerProperties(registry: DynamicPropertyRegistry) =
            registry.add("spring.kafka.bootstrap-servers") {
                kafkaContainer.bootstrapServers
            }
    }
}
```

We cannot solve this simply by switching the active profile.  
In the first step you need to implement the resolver from [JDBC](#jdbc) section to be able to switch profiles on demand.  
Now lets create a `TestConfiguration` that will handle the container creation __only__ when the `local` profile is active:
```kotlin
@TestConfiguration
// IMPORTANT: this configuration only runs when "local" profile is active
@Profile("local")
class ContainerConfiguration() {
    companion object {
        init {
            val kafkaContainer =
                KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:latest"))
                  .withKraft()

            kafkaContainer.start()
            System.setProperty(
                "spring.kafka.bootstrap-servers",
                kafkaContainer.bootstrapServers,
            )
        }
    }
}
```

In the last step use the resolver and configuration in our test case:
```kotlin
@SpringBootTest
@ActiveProfiles(resolver = ProfileResolver::class)
@Import(ContainerConfiguration::class)
class AccountBlockingStartedConsumerIntegrationTest() {
    // tests here...
    // companion object removed!
}
```

If the `PROFILE` environment variable is set to `local` or empty, the container will be created, if it is set to something else, the container won't be started since the configuration won't be applied. Make sure to set a correct URL to a running instance in the different `application-<profile>.yaml`. Maybe just use GitLab Services to create the container.
