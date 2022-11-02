/*
 * Likes YouTube videos.
 * For the newer paper design layout
 */
class PaperLiker {
	/*
	 * @constructor
	 * @param {OptionManager} options Object that must have the option 
	 *     'like_what', indicating whether to like all videos or just 
	 *      subscribed.
	 */
	constructor(options) {
		this.options = options;
		this.icon = {}
		this.btns = {}
	}

	async update_options() {
		this.options = await optionManager.get();
		log("options updated");
		return;
	}

	/**
	 * Reset the attributes
	 */
	reset() {
		this.icon = {}
		this.btns = {}
	}

	getActionsElements() {
		if (document.getElementById("menu-container")?.offsetParent === undefined) {
			log("No visible ActionsElements found.")
			return
		}

		let elem = null;
		if (document.getElementById("menu-container")?.offsetParent === null) {
			elem = document.querySelector("ytd-menu-renderer.ytd-watch-metadata > div");
		} else {
		 	elem = document.getElementById("menu-container").querySelector("#top-level-buttons-computed");
		}

		// if null or undefined
		if (elem == null) {
			log("No visible ActionsElements found.")
			return
		} else {
			log("ActionsElements found.")
			return elem
		}

	}

	/**
	 * Search the svg that has .style-scope.yt-icon (which is the svg used in yt-app)
	 * @param {string} id The id of the svg to query
	 */
	getUsedSVG(id) {
		var likeSvgRawList = document.querySelectorAll(`g#${id} path`);

		let svgs = null;
		let p = null;
		for (let item of likeSvgRawList) {
			p = item.getAttribute("d");
			svgs = document.querySelectorAll(`path[d="${p}"]`);
			for (let i of svgs) {
				if (i.matches(".style-scope.yt-icon")) return p;
			}
		}
		log("No active svg found.");
		return null;
	}

	getUsedLikeSVG() {
		return this.getUsedSVG("like");
	}

	getUsedDislikeSVG() {
		return this.getUsedSVG("dislike");
	}

	getUsedLikeFilledSVG() {
		return this.getUsedSVG("like-filled");
	}

	getUsedDislikeFilledSVG() {
		return this.getUsedSVG("dislike-filled");
	}

	getLikeDislikeElements() {
		let likeElement, dislikeElement;
		let actionsElements = this.getActionsElements();
		
		likeElement = actionsElements.querySelector("#segmented-like-button button");
		dislikeElement = actionsElements.querySelector("#segmented-dislike-button button");

		return [likeElement, dislikeElement];
	}

	getButtons() {
		let [likeElement, dislikeElement] = this.getLikeDislikeElements();
		if (likeElement === null || dislikeElement === null) {
			log("Cannot find buttons");
		}
		log("got buttons");
		return [likeElement, dislikeElement];
	}

	updateButtons() {
		[this.btns.like, this.btns.dislike] = this.getButtons();

	}

	isNewLayout() {
		return this.getUsedLikeFilledSVG() === null;
	}

	/**
	 * Detects when like/dislike buttons have loaded (so we can press them)
	 * and register element in the attributes
	 * @param {function} callback The function to execute after the buttons
	 *     have loaded
	 */
	waitForButtons(callback) {
		// wait button box load
		let box = this.getActionsElements();

		if (!box) {
			log("wait 1s for box");
			setTimeout(() => this.waitForButtons(callback), 1000 );
		} else {
			this.updateButtons();
			callback();
		}

	}

	/**
	 * Search video across all dom each time, to prevent modification (see #59)
	 * A mutation observer could be done, but may be overkill
	 */
	video() {
		return document.querySelectorAll(".video-stream")[0];
	}

	/**
	* Detects when the video player has loaded
	* @param  {function} callback The function to execute once the video has
	*     loaded.
	*/
	waitForVideo(callback) {
		if (this.video()) {
			log("Get Video.")
			callback();
		} else {
			setTimeout(() => this.waitForVideo(callback), 1000);
		}
	}

	/**
	 * Return a random integer in a given range
	 * @param {number} min An integer representing the start of the range
	 * @param {number} max An integer representing the end of the range
	 * @return {number} The random integer selected in the range
	 */
	randomIntFromInterval(min, max) { // min and max included 
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	/**
	 * Wait the number of minutes or % specified by user in the plugin option
	 * @param {function} callback The function to execute at the end of 
	 *     the timer
	 */
	waitTimer(callback) {
		// if Instant like, direct return to like
		if (this.options.like_timer == "instant") {
			log("waitTimer: instant")
			callback();
			return;
		}
		else if (this.video().closest(".ad-showing,.ad-interrupting") !== null) {
			log("waitTimer: ad")
			setTimeout(() => this.waitTimer(callback), 1000 );
		}
		else if (this.options.like_timer == "random") {
			let duration = this.video().duration;

			let nowInPercent = this.video().currentTime / duration * 100;

			if (nowInPercent >= this.randomTimerPercent) {
				callback();
			} else {
				setTimeout(() => this.waitTimer(callback), 1000 );
			}
		}
		else {
			let duration = this.video().duration;

			if (this.options.percentage_timer) {
				log("waitTimer: percent")
				let percentageAtLike = this.options.percentage_value;
				let nowInPercent = this.video().currentTime / duration * 100;
				log(nowInPercent, percentageAtLike)

				if (nowInPercent >= percentageAtLike) {
					callback();
					return;
				}
			}

			if (this.options.minute_timer) {
				log("waitTimer: minute")
				let timeAtLike = this.options.minute_value;
				// change timeAtLike if vid shorter than time set by user
				log(this.video().currentTime, this.video().duration, timeAtLike)
				if (this.video().duration < timeAtLike) {
					timeAtLike = this.video().duration;
				} else {
					// convert in second
					timeAtLike *= 60;
				}
				if (this.video().currentTime >= timeAtLike) {
					callback();
					return;
				}
			}

			// if both are disable event if custom timer is set
			if (!this.options.minute_timer && !this.options.percentage_timer) {
				// instant like
				callback();
				return;
			}

			setTimeout(() => this.waitTimer(callback), 1000 );
		}
	}

	/**
	 * Wait the video time indicator is greater the timer
	 * @param {int} timer The time in second to wait
	 * @param {function} callback The function to execute when timer is over
	 */
	waitTimerTwo(timer, callback) {
		if (this.video().currentTime >= timer) {
			callback();
			return;
		}
		setTimeout(() => this.waitTimerTwo(timer, callback), 1000);
	}

	/**
	 * Check timer not greater than video length and wait the video 
	 * time indicator to be greater than the seconds requested
	 * @param {int} timer The time in second to wait
	 * @param {function} callback The function to execute when timer is over
	 */
	startTimer(timer, callback) {
		let duration = this.video().duration;
		// change timer if vid shorter than time requested
		if (duration < timer) {
			timer = duration;
		}
		this.waitTimerTwo(timer, callback)

	}

	/**
	 * Take a wild guess
	 * @return {Boolean} True if the like or dislike button is active
	 */
	isVideoRated() {
		log("checking if video is rated");
		if (IS_CLASSIC) {
			let isRated = this.btns.like.attributes["aria-pressed"].nodeValue === "true" ||
				this.btns.dislike.attributes["aria-pressed"].nodeValue === "true";
			log("is rated: ", isRated);
			return isRated;
		} else {
			throw "Unknow youtube type";
		}
	}

	/*
	 * Another tough one
	 * @return {Boolean} True if the user is subscribed to
	 *                   the current video's channel
	 */
	isUserSubscribed() {
		return document.querySelector("ytd-subscribe-button-renderer button.yt-spec-button-shape-next--tonal") !== null;
	}

	shouldLike() {
		this.updateButtons();
		let rated = this.isVideoRated();
		if (rated) {
			log("Not like: already liked video");
			return false;
		}

		let mode_should_like = "";
		if (this.options.like_what === "subscribed") {
			log("Sub mode");
			mode_should_like = this.isUserSubscribed();	
		} else { // it all mode
			log("All mode");
			mode_should_like = true;
		}
		
		log("Use list:", this.options.use_list);
		if (this.options.use_list) {
			let list_should_like = "";
			let creator = getCreatorFromVideo();
			let creator_list = this.options.creator_list;
			let in_list = false;
			for (var i = 0; i < creator_list.length; i++) {
				if ( creator_list[i].URL === creator.URL ) {
					log("Creator is in list");
					in_list = true;
					break;
				}
			}

			if (this.options.type_list === "white") {
				log("List is in white mode")
				list_should_like = in_list;
				// in white list only the list matter
				let should_like = list_should_like;
				log(`Should like: ${should_like}`);
				return should_like;
			} else if (this.options.type_list === "black") {
				log("List is in black mode")
				list_should_like = !in_list;

				let should_like = list_should_like && mode_should_like;
				log(`Should like: ${should_like}`);
				return should_like;
			} else {
				console.error("Unknow list type for liker")
			}
		} else {
			log(`Should like: ${mode_should_like}`)
			return mode_should_like;
		}
	}

	/*
	 * Clickity click the button
	 */
	attemptLike() {
		this.btns.like.click();
	}

	/*
	 * Clickity click the skip button
	 */
/*	attemptSkip() {
		this.btns.skip.click();
	}*/

	/**
	 * Prevent multiple run if the listen event is triggered multiples times
	 */
	blockMultipleRun() {
		//if not defined this is the 1st run
		if (!this.hasOwnProperty("IS_STARTED")) { 
			this.IS_STARTED = true;
			log("blockMultipleRun: allow")
			return false;
		} else {
			if (this.IS_STARTED) {
				log("blockMultipleRun: blocked");
				return true
			} else { //could be a new video in playlist
				this.IS_STARTED = true;
				log("blockMultipleRun: allow, next video in playlist")
				return false;
			}
		}
	}

	/**
	 * Free the block to reset the multipleRun
	 */
	finish() {
		this.IS_STARTED = false;
	}

	/**
	 * Starts the liking.
	 * The liker won't do anything unless this method is called.
	 */
	async init() {
		if (this.options.like_what === "none") {
			log("yt-autolike disabled")
			return;
		}

		function isVideo() {
			return window.location.href.indexOf("watch") > -1
		}
		if (!isVideo()) {
			log("not a video");
			return;
		}

		if (this.blockMultipleRun()) {
			return;
		}
		this.reset()
		log('yt-autolike start')
		// this.skipAd(() => {
		// 	if(this.isAdPlaying) {
		// 		document.getElementsByClassName('videoAdUiSkipButton')[0].click;
		// 	}
		// });
		await this.update_options();
		this.waitForVideo(() => {
			this.waitForButtons(() => {
				/*
				If the video is already liked/disliked
				or the user isn't subscribed to this channel,
				then we don't need to do anything.
				 */
				if ( !this.shouldLike() ) {
					log("not liked check 1");
					this.finish();
					return;
				}
				/*
				Else do the stuff
				*/
				// Define a random timer if selected
				if (this.options.like_timer == "random") {
					this.randomTimerPercent = this.randomIntFromInterval(0, 99);
				}
				
				this.waitTimer(() => {
					/*
					Maybe the use did an action while we was waiting, so check again
					*/
					if ( !this.shouldLike() ) {
						log("not liked check 2");
						this.finish();
						return;
					}
					this.attemptLike();
					log('liked');
					this.options.counter += 1;
					optionManager.set(this.options).then(() => {
						this.finish();							
					});
				});
			});
		});
	}
}
