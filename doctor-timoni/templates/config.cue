package templates

import (
	timoniv1 "timoni.sh/core/v1alpha1"
)

// AppConfig defines the schema for a single app component
#AppConfig: {
	image!: timoniv1.#Image
	replicas: *1 | int & >0
	port: *80 | int & >0 & <=65535
	servicePort: *80 | int & >0 & <=65535
	nodePort: *30000 | int & >0 & <=65535

	env?: {[string]: string}
	secrets?: {[string]: string}
}

// Config defines the schema and defaults for the Instance values.
#Config: {
	kubeVersion!: string
	clusterVersion: timoniv1.#SemVer & {#Version: kubeVersion, #Minimum: "1.20.0"}
	moduleVersion!: string

	metadata: timoniv1.#Metadata & {#Version: moduleVersion}
	metadata: labels: timoniv1.#Labels

	admin: #AppConfig
	backend: #AppConfig
	frontend: #AppConfig
}

// Instance takes the config values and outputs the Kubernetes objects.
#Instance: {
	config: #Config

	objects: {
		// Admin
		"admin-deploy": #Deployment & {#component: "admin", #config: config.admin, #metaNamespace: config.metadata.namespace}
		"admin-svc": #Service & {#component: "admin", #config: config.admin, #metaNamespace: config.metadata.namespace}

		// Backend
		"backend-deploy": #Deployment & {#component: "backend", #config: config.backend, #metaNamespace: config.metadata.namespace}
		"backend-svc": #Service & {#component: "backend", #config: config.backend, #metaNamespace: config.metadata.namespace}
		if config.backend.secrets != _|_ {
			"backend-secret": #Secret & {#component: "backend", #config: config.backend, #metaNamespace: config.metadata.namespace}
		}

		// Frontend
		"frontend-deploy": #Deployment & {#component: "frontend", #config: config.frontend, #metaNamespace: config.metadata.namespace}
		"frontend-svc": #Service & {#component: "frontend", #config: config.frontend, #metaNamespace: config.metadata.namespace}
		if config.frontend.secrets != _|_ {
			"frontend-secret": #Secret & {#component: "frontend", #config: config.frontend, #metaNamespace: config.metadata.namespace}
		}
	}
}
