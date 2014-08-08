$(function() {
	// Gets the current date for displaying.
	function getDate() {
		var now = new Date();
		var year = now.getFullYear().toString().substring(2);
		var dateStr = now.getDate() + '/' + now.getMonth() + '/' + year;
		return dateStr;
	}

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
				.find('.date p').text(getDate());
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
		},

		mark: function() {
			if (!this.silent) {
				this.audio.play();
			}

			Slate.incrementTake();
		}
	});

	var Sticks = new SticksView;

	// Binds the mark and open settings buttons in the bottom toolbar.
	$('#toolbar')
		.find('.mark').click(function() {
			Cards.play();
			return false;
		}).end()
		.find('.open-settings').click(function() {
			console.log('open settings');
			return false;
		});

	// Creates grey gradient stripes at the bottom.
	function renderGradients() {
		var context = $('#toolbar canvas')[0].getContext('2d');

		var gradient1 = context.createLinearGradient(0, 0, 500, 40);
		var gradient2 = context.createLinearGradient(0, 40, 500, 80);

		gradient1.addColorStop(0, 'black');
		gradient1.addColorStop(1, 'white');
		gradient2.addColorStop(0, 'white');
		gradient2.addColorStop(1, 'black');

		context.fillStyle = gradient1;
		context.fillRect(0, 0, 500, 40);
		context.fillStyle = gradient2;
		context.fillRect(0, 40, 500, 40);
	}

	renderGradients();
});

