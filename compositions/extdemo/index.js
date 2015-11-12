define.class(function(composition, require, screens, desktop, devices, guide$search){

	this.render = function render() {

		return [
			screens(
				desktop({
					name:'desktop',
					movies:'${this.rpc.search.results}',
					searchCode:guide$search.module.factory.body.toString(),
					apiCode:  function () {
						var message = {
							"rpcid": "<see below>",
								"type": "<attribute|method>",

								"get":true|false,
								"attribute": "<attribute name>",
								"value": "<attribute value, if setting>",

								"method": "<method name>",
								"args": ["<array>", "<of>", "<arguments>"]
						}
					}.toString()
				})
		    ),
			guide$search({name:'search', keyword:"Aliens"}),
			devices({name:'dev'})
		]
	}
});