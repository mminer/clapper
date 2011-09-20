$(function() {
	var SettingsModel = Backbone.Model.extend({
		localStorage: new Store('slate'),
		id: 'settings',

		defaults: {
			production: 'Casablanca',
			roll: 3,
			scene: '2C',
			take: 5,
			director: 'Michael Curtiz',
			camera: 'Arthur Edeson',
			brightness: 'light'
		},

		initialize: function() {
			this.bind('change', function() {
				this.save();
			});
		},

		date: function() {
			var now = new Date();
			var year = now.getFullYear().toString().substring(2);
			return now.getDate() + '/' + now.getMonth() + '/' + year;
		}
	});

	var Settings = new SettingsModel;

	var SlateView = Backbone.View.extend({
		el: $('#slate'),
		model: Settings,

		events: {
			'blur p': 'saveChange',
			'keypress p': 'saveOnEnter',
			'click .take p': 'toggleTakeControls',
			'click .take .decrement': 'decrementTake',
			'click .take .increment': 'incrementTake',
			'click .take .reset': 'resetTake'
		},

		initialize: function() {
			this.model.bind('change', this.render, this);
			this.model.fetch();
			this.render();
		},

		render: function() {
			this.el
				.find('.production p').text(this.model.get('production')).end()
				.find('.roll p').text(this.model.get('roll')).end()
				.find('.scene p').text(this.model.get('scene')).end()
				.find('.take p').text(this.model.get('take')).end()
				.find('.director p').text(this.model.get('director')).end()
				.find('.camera p').text(this.model.get('camera')).end()
				.find('.date p').text(this.model.date());
			$('body').addClass(this.model.get('brightness'));
			return this;
		},

		saveChange: function(e) {
			var element = $(e.target);
			var key = element.parent().attr('class').split(' ', 1);
			var attributes = {};
			attributes[key] = element.text();
			this.model
				.set(attributes)
				.save();
		},

		saveOnEnter: function(e) {
			if (e.keyCode != 13) { return; }
			$(e.target).blur();
			this.saveChange(e);
			return false;
		},

		toggleTakeControls: function(e) {
			$(e.target).siblings('.controls').fadeToggle('fast');
		},

		incrementTake: function() {
			this.model.set({ take: this.model.get('take') + 1 });
		},

		decrementTake: function() {
			var take = this.model.get('take') - 1;
			if (take < 1) { take = 1; }
			this.model.set({ take: take });
		},

		resetTake: function(e) {
			$(e.target).parent().fadeOut('fast');
			this.model.set({ take: 1 });
		}
	});

	var Slate = new SlateView;

	var CardsView = Backbone.View.extend({
		el: $('#cards'),
		speed: 100,

		render: function() {
			var now = new Date();
			var time = now.getHours() + ':' + now.getMinutes();
			this.el.find('.time span').text(time);
			return this;
		},

		play: function() {
			this.render()
				.el.show();
			this.displayCard(this.el.children().first());
		},

		displayCard: function(card) {
			card.show();
			var nextCard = card.next();

			if (nextCard.length === 0) {
				// Exit once we've run out of cards
				this.trigger('done');
				this.el.fadeOut();
			} else {
				var self = this;

				setTimeout(function() {
					card.hide();
					self.displayCard(nextCard);
				}, this.speed);
			}
		}
	});

	var Cards = new CardsView;

	var SticksView = Backbone.View.extend({
		el: $('#sticks'),
		silent: false,

		initialize: function() {
			Cards.bind('done', this.mark, this);

			this.audio = this.el.children('audio')[0];
			this.context = this.el.children('canvas')[0].getContext('2d');
			this.render();
		},

		render: function() {
			if (Slate.model.get('brightness') === 'light') {
				this.context.fillStyle = 'black';
			} else {
				this.context.fillStyle = 'white';
			}

			this.context.fillRect(0, 0, 1024, 80);
			this.context.lineWidth = 49;
			this.context.lineCap = 'square';

			var colours = ['rgb(255, 255, 255)', 'rgb(193, 193, 193)', 'rgb(193, 193, 0)', 'rgb(0, 193, 193)', 'rgb(0, 193, 0)', 'rgb(193, 0, 193)', 'rgb(193, 0, 0)', 'rgb(0, 0, 193)', 'rgb(255, 255, 255)'];

			for (var i = 0; i < colours.length; i++) {
				this.context.strokeStyle = colours[i];
				var x = (i * 138) - 60;

				this.context.beginPath();
				this.context.moveTo(x, 0);
				this.context.lineTo(x + 40, 40);
				this.context.moveTo(x + 40, 40);
				this.context.lineTo(x, 80);
				this.context.stroke();
			}

			return this;
		},

		mark: function() {
			if (!this.silent) {
				this.audio.play();
			}

			Slate.incrementTake();
		}
	});

	var Sticks = new SticksView;

	var ToolbarView = Backbone.View.extend({
		el: $('#toolbar'),

		events: {
			'click .mark': 'triggerClap',
			'click .open-settings': 'openSettings'
		},

		initialize: function() {
			this.context = this.el.children('canvas')[0].getContext('2d');
			this.render();
		},

		render: function() {
			var gradient1 = this.context.createLinearGradient(0, 0, 500, 40);
			var gradient2 = this.context.createLinearGradient(0, 40, 500, 80);

			gradient1.addColorStop(0, 'black');
			gradient1.addColorStop(1, 'white');
			gradient2.addColorStop(0, 'white');
			gradient2.addColorStop(1, 'black');

			this.context.fillStyle = gradient1;
			this.context.fillRect(0, 0, 500, 40);
			this.context.fillStyle = gradient2;
			this.context.fillRect(0, 40, 500, 40);

			return this;
		},

		triggerClap: function() {
			Cards.play();
		},

		openSettings: function() {
			console.log('open settings');
			return false;
		}
	});

	var Toolbar = new ToolbarView;


});
