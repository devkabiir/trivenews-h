console.log("FFFFFFFFFFFFFFFFFFFFFFFFFF")
// var $ = require('jquery')
window.addEventListener('load', function () {
	window.vm = new Vue({
		el: '#app-v',
		data: {
			message: 'Hello Vue.js!',
			unscored: null,
			scored: null
		},
		methods: {
			fetchUnscored: function () {
				var self = this;
				window.$.get("/api/documents", {
					unscored_only: "true",
					cachebuts: (new Date().getTime())
				}, function(data) {
					self.unscored = data;
				})
			},
			fetchScored: function () {
				var self = this;
				window.$.get("/api/documents", {
					scored_only: "true",
					cachebust: (new Date().getTime())
				}, function (data) {
					self.scored = data;
				})
			},
			fetchAnnotationsForDocument: function (document) {
				console.log('fetching')
				window.$.get("/api/annotations", {
					document_id:document.id	
				}, function (data) {
					console.log(data);
					Vue.set(document, "annotations", data)
					document.loadingAnnotations = false;
				})
			},
			toggleShowDetails: function (document) {
				if (!document.showDetails) {
					Vue.set(document, "showDetails", true);
					Vue.set(document, "loadingAnnotations", true);
					this.fetchAnnotationsForDocument.call(this,document)
				}
				else {
					document.showDetails = false;
				}
				console.log(document);
			}
		},
		created: function () {
			// setTimeout( () => {
				this.fetchUnscored.call(this)
				this.fetchScored.call(this)
			// },1000)
		},
		components: {
			"avg-score": {
				props: {
					score: null
				},
				computed: {
					scoreColor: function () {
						if (!this.score)
							this.score = 0;
						if (this.score < -50)
							return "#F03E3E"
						if (this.score < 0)
							return "#ff920b"
						if (this.score < 50)
							return "#FFDD00"
						return "#57de36"
					}
				},
				template: '<span class="info-square" v-bind:style="{background:scoreColor}">{{score}}</span>'
			},
			"domain": {
				props: {
					uri:null
				},
				computed: {
					domain: function () {
						return this.uri.replace(/^https?:\/\//,"").split(/[/?#]/)[0];
					}
				},
				template: '<a>{{domain}}</a>'
			},
			"document-list-item": {
				props: {
					document: null,
					showScore: null
				},
				template: `<p>bobobobobjjjjj</p>`
			}
		}
	});
})