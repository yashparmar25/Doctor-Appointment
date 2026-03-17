package templates

import (
	corev1 "k8s.io/api/core/v1"
)

#Service: corev1.#Service & {
	#component: string
	#config:    #AppConfig
	#metaNamespace: string
	
	apiVersion: "v1"
	kind:       "Service"
	metadata: {
		name: "\(#component)-service"
		namespace: #metaNamespace
		labels: {
			app: #component
		}
	}
	spec: corev1.#ServiceSpec & {
		type:     corev1.#ServiceTypeNodePort
		selector: app: #component
		ports: [
			{
				port:       #config.servicePort
				targetPort: #config.port
				nodePort:   #config.nodePort
			},
		]
	}
}
