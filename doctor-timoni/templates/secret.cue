package templates

import (
	corev1 "k8s.io/api/core/v1"
)

#Secret: corev1.#Secret & {
	#component: string
	#config:    #AppConfig
	#metaNamespace: string

	apiVersion: "v1"
	kind:       "Secret"
	type:       "Opaque"
	metadata: {
		name: "\(#component)-secret"
		namespace: #metaNamespace
		labels: {
			app: #component
		}
	}
	if #config.secrets != _|_ {
		stringData: #config.secrets
	}
}
