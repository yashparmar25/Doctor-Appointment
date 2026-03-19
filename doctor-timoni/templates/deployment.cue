package templates

import (
	appsv1 "k8s.io/api/apps/v1"
	corev1 "k8s.io/api/core/v1"
)

#Deployment: appsv1.#Deployment & {
	#component: string
	#config:    #AppConfig
	#metaNamespace: string
	
	apiVersion: "apps/v1"
	kind:       "Deployment"
	metadata: {
		name: "\(#component)-deploy"
		namespace: #metaNamespace
		labels: {
			app: #component
		}
	}
	spec: appsv1.#DeploymentSpec & {
		replicas: #config.replicas
		selector: matchLabels: app: #component
		template: {
			metadata: {
				labels: app: #component
			}
			spec: corev1.#PodSpec & {
				containers: [
					{
						name:            #component
						image:           #config.image.reference
						ports: [
							{
								containerPort: #config.port
							},
						]
						if #config.env != _|_ {
							env: [
								for k, v in #config.env {
									name:  k
									value: v
								},
							]
						}
						if #config.secrets != _|_ {
							envFrom: [
								{
									secretRef: name: "\(#component)-secret"
								},
							]
						}
					},
				]
			}
		}
	}
}
