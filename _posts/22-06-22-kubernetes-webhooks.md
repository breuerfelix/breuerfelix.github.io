---
layout: post
title: Simple Kubernetes Mutating Admission Webhook
date: 2022-06-22 11:00:00 +01:00
tags: kubernetes admission mutating webhook simple minimal example cert-manager
category: blog
---

TLDR; Check out [this](https://github.com/breuerfelix/juicefs-volume-hook) GitHub Repository for a minimal example.  

I haven't found any minimal example for a working Kubernetes admission webhook made with kubebuilder so here is mine.  
This example just annotates all created Pods with a nice message.  
A lot of code commands and code with comments, as always!  

## Bootstrap

We are going to use Kubebuilder to bootstrap our project.  

```bash
mkdir pod-webhook
cd pod-webhook
kubebuilder init --domain github.com --repo github.com/breuerfelix/pod-webhook
```

I didn't manage to generate valid configuration files with `controller-gen` when only using webhooks without writing a controller.  
Also I don't like `kustomize`, which kubebuilder is using when generating the manifests so let us get rid of all the boilerplate code.  
The `Makefile` won't make sense either anymore. Dump it and write your own if needed.  

```bash
rm -rf config hack Makefile
```

We do not need leader election for a minimal example (you can also remove all kubebuilder comments since we don't use the generator anyways).  

```diff
diff --git a/main.go b/new_main.go
index 9052d2a..18780eb 100644
--- a/main.go
+++ b/new_main.go
@@ -46,13 +46,9 @@ func init() {
 
 func main() {
 	var metricsAddr string
-	var enableLeaderElection bool
 	var probeAddr string
 	flag.StringVar(&metricsAddr, "metrics-bind-address", ":8080", "The address the metric endpoint binds to.")
 	flag.StringVar(&probeAddr, "health-probe-bind-address", ":8081", "The address the probe endpoint binds to.")
-	flag.BoolVar(&enableLeaderElection, "leader-elect", false,
-		"Enable leader election for controller manager. "+
-			"Enabling this will ensure there is only one active controller manager.")
 	opts := zap.Options{
 		Development: true,
 	}
@@ -66,8 +62,7 @@ func main() {
 		MetricsBindAddress:     metricsAddr,
 		Port:                   9443,
 		HealthProbeBindAddress: probeAddr,
-		LeaderElection:         enableLeaderElection,
-		LeaderElectionID:       "ed15f5f0.github.com",
+		LeaderElection:         false,
 	})
 	if err != nil {
 		setupLog.Error(err, "unable to start manager")
```

`go run .` should successfully build and run the project.  
Modify the `Dockerfile` so it respects our new project structure and verify your changes with a `docker build -t test .`.  

```diff
diff --git a/old_Dockerfile b/Dockerfile
index 456533d..b53359f 100644
--- a/old_Dockerfile
+++ b/Dockerfile
@@ -10,9 +10,7 @@ COPY go.sum go.sum
 RUN go mod download
 
 # Copy the go source
-COPY main.go main.go
-COPY api/ api/
-COPY controllers/ controllers/
+COPY *.go .
 
 # Build
 RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -o manager main.go
```

## Implement the Webhook

The [Kubebuilder Book](https://book.kubebuilder.io/reference/webhook-for-core-types.html) references the [following example](https://github.com/kubernetes-sigs/controller-runtime/tree/master/examples/builtins) on GitHub.  
We are going to strip these files and integrate them into our bootstraped kubebuilder project.  

Create a file called `webhook.go`:

```go
package main

import (
	"context"
	"encoding/json"
	"net/http"

	corev1 "k8s.io/api/core/v1"
	"sigs.k8s.io/controller-runtime/pkg/client"
	"sigs.k8s.io/controller-runtime/pkg/webhook/admission"
)

type podAnnotator struct {
	Client  client.Client
	decoder *admission.Decoder
}

func (a *podAnnotator) Handle(ctx context.Context, req admission.Request) admission.Response {
	pod := &corev1.Pod{}
	if err := a.decoder.Decode(req, pod); err != nil {
		return admission.Errored(http.StatusBadRequest, err)
	}

	// mutating code start
	pod.Annotations["welcome-message"] = "i mutated you but that is okay"
	// mutating code end

	marshaledPod, err := json.Marshal(pod)
	if err != nil {
		return admission.Errored(http.StatusInternalServerError, err)
	}

	return admission.PatchResponseFromRaw(req.Object.Raw, marshaledPod)
}

func (a *podAnnotator) InjectDecoder(d *admission.Decoder) error {
	a.decoder = d
	return nil
}
```

Add the `podAnnotator` as a webhook to our manager:

```diff
diff --git a/old_main.go b/main.go
index 8db76b2..48544b3 100644
--- a/old_main.go
+++ b/main.go
@@ -12,6 +12,7 @@ import (
 	ctrl "sigs.k8s.io/controller-runtime"
 	"sigs.k8s.io/controller-runtime/pkg/healthz"
 	"sigs.k8s.io/controller-runtime/pkg/log/zap"
+	"sigs.k8s.io/controller-runtime/pkg/webhook"
 )
 
 var (
@@ -48,6 +49,8 @@ func main() {
 		os.Exit(1)
 	}
 
+	mgr.GetWebhookServer().Register("/mutate-pod", &webhook.Admission{Handler: &podAnnotator{Client: mgr.GetClient()}})
+
 	if err := mgr.AddHealthzCheck("healthz", healthz.Ping); err != nil {
 		setupLog.Error(err, "unable to set up health check")
 		os.Exit(1)
```

If you run the project via `go run .` now, it says that it is missing certificates. CERTIFICATES?? yes ... but wait, you won't see any certificate here, I promise!  
Just make sure that it builds without errors and you should be fine.  

## Deploy

Kubernetes is not able to call webhooks which are insecure and not protected via HTTPS.  
To handle this, we are going to use [cert-manager](https://cert-manager.io/docs/) and let it handle all that nasty stuff.  
Refer to [this](https://cert-manager.io/docs/installation/) guide for the installation of cert-manager, I recommend using Helm.  

First of all, let us create a namespace for all our stuff:

```bash
kubectl create namespace pod-greeter
```

Create a cert-manager `Issuer` that handles self-signed certificates and a `Certificate` itself:

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: selfsigned
  namespace: pod-greeter
spec:
  selfSigned: {}

---

apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: pod-greeter
  namespace: pod-greeter
spec:
  # remember the secretName
  secretName: pod-greeter-tls
  dnsNames:
    # IMPORTANT: format is the following namespace.service-name.svc
    - pod-greeter.pod-greeter.svc
  issuerRef:
    name: selfsigned

```

Create a `Service` that matches the DNS name format in our `Certificate`:

```yaml
apiVersion: v1
kind: Service
metadata:
  # resolves to pod-greeter.pod-greeter.svc
  name: pod-greeter
  namespace: pod-greeter
spec:
  ports:
    - name: https
      port: 9443
      protocol: TCP
  selector:
    # IMPORTANT:
    # this has to match the selector in our Deployment later
    app: pod-greeter
```

Create a `Deployment` that matches the selector in our `Service`.  
Also make sure that the `secretName` matches the one in `Certificate`.  
Cert-manager automatically creates a `Secret` that contains the generated certificates so we can mount them in our pod.  

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pod-greeter
  namespace: pod-greeter
spec:
  selector:
    matchLabels:
      # IMPORTANT
      app: pod-greeter
  replicas: 1
  template:
    metadata:
      labels:
        # IMPORTANT
        app: pod-greeter
    spec:
      containers:
      - name: pod-greeter
        image: ghcr.io/breuerfelix/pod-webhook:latest
        imagePullPolicy: Always
        volumeMounts:
        - name: tls
          # the tls certificates automatically get mounted into the correct path
          mountPath: "/tmp/k8s-webhook-server/serving-certs"
          readOnly: true
        livenessProbe:
          httpGet:
            path: /healthz
            port: 8081
          initialDelaySeconds: 15
          periodSeconds: 20
        readinessProbe:
          httpGet:
            path: /readyz
            port: 8081
          initialDelaySeconds: 5
          periodSeconds: 10
      terminationGracePeriodSeconds: 10
      volumes:
        - name: tls
          secret:
            # IMPORTANT: has to match from Certificate
            secretName: pod-greeter-tls
            # the pod only gets created if the secret exists
            # so it waits until the cert-manager is done
            optional: false
```

As the last step we can finally create our `MutatingWebhookConfiguration` to tell Kubernetes that it should call the correct endpoint of our controller.  
Due to the cert-manager annotation, all certificates are going to be injected in this webhook configuration at runtime by cert-manager.  
I told you that you won't see any certs here!  

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingWebhookConfiguration
metadata:
  name: pod-greeter
  annotations:
    # IMPORTANT: has to match Certificate namespace.name
    cert-manager.io/inject-ca-from: pod-greeter/pod-greeter
webhooks:
- admissionReviewVersions:
  - v1
  clientConfig:
    service:
      # has to match the service we created
      namespace: pod-greeter
      name: pod-greeter
      port: 9443
      path: "/mutate-pod"
  failurePolicy: Fail
  name: mpod.kb.io
  rules:
  - apiGroups:
    - ""
    apiVersions:
    - v1
    operations:
    - CREATE
    - UPDATE
    resources:
    - pods
  sideEffects: None
```

You are done! Let us test it out by creating a simple pod:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
  - name: nginx
    image: nginx:1.14.2
    ports:
    - containerPort: 80
```

Fetch it and have a look at the annotations. It should have a welcoming message!

```bash
kubectl get pods
```

## Development

So far we haven't really run and test the controller locally. And I haven't done that myself either, sadly!  
I figured out two possible scenarios to do so:
* start a `minikube` or `kind` locally, deploy the controller, and test it
* use `clientConfig.url` in the `MutatingWebhookConfiguration` with `ngrok` to proxy your local instance into a remote cluster

The last one is probably the easiest but it requires to run the controller without certificates and so far I haven't figured out how to do so.  
The manager expects a tls certificate whenever you register a webhook.  
If you got that figured out, please reach out to me! I would love to update my guide and also use this approach for my projects :)

