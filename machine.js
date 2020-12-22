// import { assign, createMachine, interpret, Machine, } from 'https://esm.run/xstate'
const { assign, Machine, actions, interpret } = XState
// import { assign, createMachine, interpret, Machine, } from "xstate"

var sound1 = new Howl({
  src: ['audio/meow0.mp3']
})
sound1.once('play', function() {
	label.innerHTML = 'See Console';
	setTimeout(2000);
});
id = sound1.play()
sound1.stop(id)

// sound1.play(id)

let song = {
	'test song': 'me',
	b: 500,
	c: 1000,
	fs: 1000,
}
let songLength = Object.keys(song).length
console.log(songLength)

const noteplayerMachine = Machine({
	id: 'noteplayer',
	initial: 'idle',
	context: {
		notePosition: 0,
		noteName: 'gs'
	},
	states: {
		idle: {
			on: {
				START: 'increment'
			}
		},
		increment: {
			entry: 'incPosition',
			always: [
				{ target: 'route', cond: context => context.notePosition < songLength },
				{ target: 'final' },
			],
		},
		route: {
			entry: 'setNote',
			always: [
				{ target: 'play.a',	cond: context => context.noteName === 'a' },
				{ target: 'play.as',cond: context => context.noteName === 'as' },
				{ target: 'play.b', cond: context => context.noteName === 'b' },
				{ target: 'play.c', cond: context => context.noteName === 'c' },
				{ target: 'play.cs',cond: context => context.noteName === 'cs' },
				{ target: 'play.d', cond: context => context.noteName === 'd' },
				{ target: 'play.ds',cond: context => context.noteName === 'ds' },
				{ target: 'play.e', cond: context => context.noteName === 'e' },
				{ target: 'play.f', cond: context => context.noteName === 'f' },
				{ target: 'play.fs',cond: context => context.noteName === 'fs' },
				{ target: 'play.g', cond: context => context.noteName === 'g' },
				{ target: 'play.gs',cond: context => context.noteName === 'gs' },
				{ target: 'play.rest', cond: context => context.noteName === 'rest' },
			],
		},
		play: {
			initial: 'rest',
			// before: { 1000}
			states: {
				'a': { entry: 'playSound' },
				'as': { entry: 'playSound' },
				'b': { entry: 'playSound' },
				'c': { entry: 'playSound' },
				'cs': { entry: 'playSound' },
				'd': { entry: 'playSound' },
				'ds': { entry: 'playSound' },
				'e': { entry: 'playSound' },
				'f': { entry: 'playSound' },
				'fs': { entry: 'playSound' },
				'g': { entry: 'playSound' },
				'gs': { entry: 'playSound' },
				'rest': { entry: 'playSound' },
			},
			after: {
				NOTE_DELAY: 'end',
			},
		},
		// hold: {
		// 	after: {
		// 		NOTE_DELAY: 'end',
		// 	},
		// },
		end: {
			entry: (context, event) => {
				sound1.stop(id)
				// console.log('end.')
			},
			after: {
				1: 'increment',
			},
		},
		final: {
			entry: (context, event) => { console.log('final.'); },
			type: 'final'
		},
	},
},{
	actions: {
		incPosition: assign({
			notePosition: context => context.notePosition + 1
		}),
		playSound: (context, event) => {
			// console.log( 'play: '+ context.noteName )
			sound1.play(id)
		},
		setNote: assign({
			noteName: context => Object.keys(song)[context.notePosition]
		}),
	},
	delays: {
		NOTE_DELAY: (context, event) => {
			return song[context.noteName]
		},
	},
	guards: {
	}
})

const notePlayer = interpret( noteplayerMachine )
	.onTransition( state => {
		console.log( JSON.stringify(state.value) +' ~ '+ JSON.stringify(state.context) )
	}
)


notePlayer.start()
notePlayer.send({
	type: "START",
	notename: 'A',
	noteLength: 1000,
})


setTimeout( ()=>{
	console.log('now stopping...')
	notePlayer.stop()
}, 5000);
