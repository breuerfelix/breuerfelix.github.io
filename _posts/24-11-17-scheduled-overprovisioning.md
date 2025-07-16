---
layout: post
title: Simple Kubernetes scheduled Overprovisioning
date: 2024-11-17 09:00:00 +01:00
tags: kubernetes scheduled overprovisioning
category: blog
---

In some scenarios, you need to overprovision your Kubernetes cluster only at certain times. Imagine running CI/CD jobs in your cluster. There might be more pending jobs during work hours. Wouldn't it be nice to have some empty space in your cluster for new jobs to be scheduled immediately and increase your developer experience?

Best part, you don't even need any fancy tools for this. Here is an implementation with some basic resources.  
First, let's create the workload that requests resources but gets evicted for real jobs:
```yaml
---
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: overprovisioning
# make sure this is 
value: -100
globalDefault: false
description: "Priority class used by overprovisioning."
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: overprovisioning
  # make sure to create the namespace
  namespace: overprovisioning
spec:
  replicas: 1
  selector:
    matchLabels:
      app: overprovisioning
  template:
    metadata:
      labels:
        app: overprovisioning
    spec:
      nodeSelector:
        # requests a certain type of node if you have multiple node pools
        nodepool: job-executor
      containers:
      - name: overprovisioning
        # make sure to set a proper version!
        image: public.ecr.aws/eks-distro/kubernetes/pause:latest
        resources:
          # request enough resources to fill 1 node
          requests:
            cpu: 28
            memory: 100Gi
      # refers to the priorityclass above
      priorityClassName: overprovisioning
```

Since one pod of the `Deployment` above requests enough resources to fill up one full node, the number of replicas is equal to the number of spare nodes you want to have.  
Now let's get into the scheduled part. We use a simple `CronJob` with `kubectl` and some RBAC for that:
```yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: overprovisioning
  namespace: overprovisioning
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: overprovisioning
  namespace: overprovisioning
rules:
- apiGroups:
  - apps
  resources:
  - deployments/scale
  - deployments
  resourceNames:
  - overprovisioning
  verbs:
  - get
  - update
  - patch
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: overprovisioning
  namespace: overprovisioning
subjects:
  - kind: ServiceAccount
    name: overprovisioning
    namespace: overprovisioning
roleRef:
  kind: Role
  name: overprovisioning
  apiGroup: rbac.authorization.k8s.io
```

These allow our `CronJob` to access and scale the `Deployment` we just created.  
The following resources manage the up- and downscaling of our overprovisioning workload:
```yaml
---
apiVersion: batch/v1
kind: CronJob
metadata:
  name: upscale-overprovisioning
  namespace: overprovisioning
spec:
  # upscale in the morning on weekdays
  schedule: "0 6 * * 1-5"
  jobTemplate:
    spec:
      template:
        spec:
          restartPolicy: Never
          serviceAccountName: overprovisioning
          containers:
            - name: scaler
              # make sure to use a proper version here!
              image: bitnami/kubectl:latest
              # the replicas are your desired node count
              command:
                - /bin/sh
                - -c
                - |
                  kubectl scale deployment overprovisioning --replicas=2
---
apiVersion: batch/v1
kind: CronJob
metadata:
  name: downscale-overprovisioning
  namespace: overprovisioning
spec:
  # downscale after work
  schedule: "0 17 * * 1-5"
  jobTemplate:
    spec:
      template:
        spec:
          restartPolicy: Never
          serviceAccountName: overprovisioning
          containers:
            - name: scaler
              # make sure to use a proper version here!
              image: bitnami/kubectl:latest
              # just use 0 replicas to stop overprovisioning
              command:
                - /bin/sh
                - -c
                - |
                  kubectl scale deployment overprovisioning --replicas=0
```

That's it! No Helm chart, no custom operator, just some basic Kubernetes resources.
