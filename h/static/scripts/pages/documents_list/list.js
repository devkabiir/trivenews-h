// var $ = require('jquery')
window.addEventListener('load', function () {
	console.log("Loaded")
	// if (!document.getElementById("#app-v"))
	// 	return;
	window.vm = new Vue({
		el: '#app-v',
		data: {
			message: 'Hello Vue.js!',
			unscored: null,
			scored: null,
			loadingUnscored: true,
			loadingScored: true,
			unscoredPaginationData: {
				currentPage: 1,
				perPage: 10,
				total: 0
			},
			scoredPaginationData: {
				currentPage: 1,
				perPage: 10,
				total: 0
			}
		},
		methods: {
			fetchUnscored: function () {
				var self = this;
				window.$.get("/api/documents", {
					unscored_only: "true",
					page: this.unscoredPaginationData.currentPage,
					perPage: this.unscoredPaginationData.perPage,
					cachebust: (new Date().getTime())
				}, function (data) {
					self.unscored = data.documents;
					self.unscoredPaginationData.total = data.count;
					self.loadingUnscored = false;
				})
			},
			fetchScored: function () {
				var self = this;
				window.$.get("/api/documents", {
					scored_only: "true",
					perPage: this.scoredPaginationData.perPage,
					page: this.scoredPaginationData.currentPage,
					cachebust: (new Date().getTime())
				}, function (data) {
					self.scored = data.documents;
					self.scoredPaginationData.total = data.count;
					self.loadingScored = false;
				})
			},
			scoredPaginationChanged: function (value) {
				if (this.loadingScored)
					return;
				this.scoredPaginationData.currentPage = value.currentPage;
				this.loadingScored = true;
				this.fetchScored.call(this)
			},
			unscoredPaginationChanged: function (value) {
				if (this.loadingUnscored)
					return;
				this.unscoredPaginationData.currentPage = value.currentPage;
				this.loadingUnscored = true;
				this.fetchUnscored.call(this);
			}
		},
		created: function () {
			// setTimeout( () => {
			this.fetchUnscored.call(this)
			this.fetchScored.call(this)
			// },1000)
		}
	});
})

Vue.component("document", {
	props: ["doc","unscored"],
	data: function () {
		return {
			showDetails: false,
			annotations: null,
			loadingAnnotations: true
		}
	},
	computed: {
		domain: function () {
			return this.doc.web_uri && this.doc.web_uri.replace(/^https?:\/\//, "").split(/[/?#]/)[0];
		},
		docClass: function () {
			return { 'expanded': this.showDetails }
		},
		truthinessText: function () {
			return getTruthinessText(this.doc.avg_score);
		}
	},
	methods: {
		fetchAnnotations: function () {
			var self = this;
			window.$.get("/api/annotations", {
				document_id: this.doc.id
			}, function (data) {
				self.annotations = data;
				self.loadingAnnotations = false;
				self.loadingAnnotations = false;
			})
		},
		toggleShowDetails: function () {
			if (!this.showDetails) {
				this.showDetails = true;
				this.loadingAnnotations = true;
				this.fetchAnnotations.call(this)
			}
			else {
				this.showDetails = false;
			}
		}
	},
	template:
	'<div class="doc-container" v-on:click="toggleShowDetails" v-bind:class="docClass">' +
	'   <div class="annotated-doc doc-summary">' +
	'        <div class="page-title">' +
	'            <span>{{doc.title}}</span>' +
	'            <div class="domain">' +
	'                <a>{{domain}}</a>' +
	'            </div>' +
	'        </div>' +
	'        <div class="avg-score-container" v-if="!unscored">' +
	'            <avg-score v-bind:score="doc.avg_score"></avg-score>' +
	'        </div>' +
	'        <div class="num-annotations-container">' +
	'            <span class="info-square">{{doc.num_annotations}}</span>' +
	'        </div>' +
	'    </div>' +
	'    <div class="doc-details-container" v-if="showDetails">' +
	'        <div class="annotations-container">' +
	'            <p v-if="loadingAnnotations" class="rubberBand">Loading</p>' +
	'            <annotation :annotation="annotation" v-for="annotation in annotations" :key="annotation.id"></annotation>' +
	'        </div>' +
	'        <div class="doc-details">' +
	'            <p class="doc-url-header">URL</p>' +
	'            <p class="doc-url">' +
	'                <a :href="doc.web_uri" target="_blank">{{doc.web_uri}}</a>' +
	'            </p>' +
	'            <p class="doc-url-header"  v-if="!this.unscored">Truth-O-Meter</p>' +
	'            <p class="doc-url" v-if="!this.unscored">' +
	'                {{truthinessText}}' +
	'            </p>' +
	'			 <p class=""  v-if="!this.unscored">' +
	'				<truthiness-gauge :value="doc.avg_score"></truthiness-gauge>' +
	'			 </p>' +
	'        </div>' +
	'    </div>' +
	'</div>',
	components: {
		"avg-score": {
			props: {
				score: null
			},
			computed: {
				scoreColor: function () {
					return getScoreColor(this.score);
				}
			},
			template: '<span class="info-square" v-bind:style="{background:scoreColor}">{{score}}</span>'
		},
		"doc-list-item": {
			props: {
				doc: null,
				showScore: null
			},
			template: `<p>bobobobobjjjjj</p>`
		},
		"annotation": {
			props: {
				annotation: null
			},
			computed: {
				scoreColor: function () {
					return getScoreColor(this.annotation.truthiness)
				},
				truthinessStyle: function () {
					return { 'background-color': this.scoreColor }
				}
			},
			methods: {
				annotationClicked: function (event) {
					event.stopPropagation();
				}
			},
			template:
			'<div class="annotation-container" v-on:click="annotationClicked">' +
			'	<div class="annotation-username">{{annotation.username}}</div>' +
			'	<p class="quote" v-html="annotation.quote"></p>' +
			'	<p class="annotation-text" v-html="annotation._text_rendered"></p>' +
			'	<p class="references-header">References</p>' +
			'	<div class="reference" v-for="source in annotation.sources">' +
			'		<link-display :url="source"></link-display>' +
			'   </div > ' +
			'	<p class="truthiness-header">Truth-O-Meter</p>' +
			'	<p class="truthiness-score" v-bind:style="truthinessStyle">{{annotation.truthiness}}</p>' +
			'</div>'
		}
	}
})
Vue.component("link-display", {
	props: ["url"],
	computed: {
		fullHref: function () {
			if (!this.url)
				return "";
			if (this.url.slice(0, 4) !== "http")
				return "http://" + this.url;
			return this.url;
		},
		prettyLinkText: function () {
			if (!this.url)
				return "";
			if (this.url.slice(0, 8).toLowerCase() == "https://")
				return this.url.slice(8);
			if (this.url.slice(0, 7).toLowerCase() == "http://")
				return this.url.slice(7);
			return this.url;
		}
	},
	template: '<a :href="fullHref">{{prettyLinkText}}</a>'
})
Vue.component("truthiness-gauge", {
	props: ['value'],
	mounted: function () {
		this.$nextTick(function () {
			var gaugeOptions = {
				angle: 0, // The span of the gauge arc
				lineWidth: 0.4, // The line thickness
				radiusScale: .7, // Relative radius
				pointer: {
					length: 0.6, // // Relative to gauge radius
					strokeWidth: 0.035, // The thickness
					color: '#000000' // Fill color
				},
				// percentColors: [[0.0, "#a9d70b"], [0.50, "#f9c802"], [1.0, "#ff0000"]],
				limitMax: true,     // If false, max value increases automatically if value > maxValue
				limitMin: true,     // If true, the min value of the gauge will be fixed
				// colorStart: '#6FADCF',   // Colors
				// colorStop: '#59C5DA',    // just experiment with them
				strokeColor: '#E0E0E0',  // to see which ones work best for you
				staticZones: [
					{ strokeStyle: "#F03E3E", min: -100, max: -50 }, // Red from 100 to 130
					{ strokeStyle: "#ff920b", min: -50, max: 0 }, // Orange
					{ strokeStyle: "#FFDD00", min: 0, max: 50 }, // Yellow
					{ strokeStyle: "#34d60b", min: 50, max: 100 }, // Green
				],
				generateGradient: true,
				highDpiSupport: true     // High resolution support
			};
			var target = this.$el
			this.gauge = new Gauge(target).setOptions(gaugeOptions);
			this.gauge.minValue = -100;
			this.gauge.maxValue = 100; // set max gauge value
			this.gauge.set(this.value);
			this.gauge.animationSpeed = 10000; // set animation speed (32 is default value)
		})
	},
	template: '<canvas class="gauge-canvas"></canvas>'
})
Vue.component("pagination", {
	props: ["value"],
	computed: {
		numberOfPages: function () {
			if (!this.value.total)
				return 0;
			return Math.ceil(this.value.total / this.value.perPage);
		},
		pageChoices: function () {
			if (this.numberOfPages < 1)
				return []

		},
		previousButtonStyle: function () {
			return { visibility: this.value.currentPage == 1 ? "hidden" : "initial" }
		},
		nextButtonStyle: function () {
			return { visibility: this.value.currentPage < this.numberOfPages ? "initial" : "hidden" }
		}
	},
	methods: {
		goToNextPage: function () {
			this.$emit("input", Object.assign(this.value, {
				currentPage: this.value.currentPage + 1
			}))
		},
		goToPreviousPage: function () {
			this.$emit("input", Object.assign(this.value, {
				currentPage: this.value.currentPage - 1
			}))
		}
	},
	template:
	'<div class="pagination">' +
	'	<div class="previous page-button" :style="previousButtonStyle" v-on:click="goToPreviousPage">&lt;</div>' +
	'	<div class="" v-if="numberOfPages">Page {{value.currentPage}} of {{numberOfPages}}</div>' +
	'	<div class="" v-if="!numberOfPages">Nothing in this list</div>' +
	'	<div class="next page-button" :style="nextButtonStyle" v-on:click="goToNextPage">&gt;</div>' +
	'</div>'
})

function getScoreColor(score) {
	if (!score)
		score = 0;
	if (score < -50)
		return "#F03E3E"
	if (score < 0)
		return "#ff920b"
	if (score < 50)
		return "#FFDD00"
	return "#57de36"
}
function getTruthinessText(score) {
	if (!score)
		score = 0;
	if (score < -50)
		return "BLATANT LIE!"
	if (score < 0)
		return "Probably False"
	if (score < 50)
		return "Maybe"
	return "Probably True"
}