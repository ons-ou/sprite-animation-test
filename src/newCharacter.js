import React, {useCallback, useEffect, useReducer, useRef, useState} from 'react';

const CONTAINER_WIDTH = window.innerWidth
const CONTAINER_HEIGHT = window.innerHeight/4
const SPRITE_DIMENSIONS = {idle: [64, 32], run: [384, 32]}
const SPRITE_DIRECTIONS = {right: 0, up: 1, left:2, down:3}
const SCALE = (CONTAINER_HEIGHT/62)
const STEP = 1
const CHARACTER_WIDTH = 16 * SCALE
const CHARACTER_HEIGHT = 32 * SCALE

let characterMoving = false
let currentSprite = 0
let animationFrame
let frame=0

function reducer(state, action){
    if (action.type === 'run') {
        let move
        let border
        let newLeft = state.left
        let newBottom = state.bottom
        switch (action.direction) {
            case 'left':
                move = newLeft - STEP * currentSprite
                newLeft = move > 0 ? move : 0
                break;
            case 'right':
                move = newLeft + STEP * currentSprite
                border = CONTAINER_WIDTH - CHARACTER_WIDTH
                newLeft = move < border ? move : border
                break;
            case 'up':
                move = newBottom + STEP * currentSprite
                border = CONTAINER_HEIGHT - CHARACTER_HEIGHT +20
                newBottom = move < border ? move : border
                break;
            case 'down':
                move = newBottom - STEP * currentSprite
                newBottom = move > 0 ? move : 0
                break;
            default:
                break;
        }
        return {left: newLeft, bottom: newBottom}
    }
    throw Error('Unknown action: ' + action.type);
}

function NewCharacter(props) {
    let characterRef= useRef()
    let [sprite, setSprite]= useState('idle')
    let [position, dispatch] = useReducer(reducer, {left: 0, bottom: 0})
    let [direction, setDirection] = useState('down')
    let [sx, setSx] = useState(3 )

    const style= {
        width: CHARACTER_WIDTH,
        height: CHARACTER_HEIGHT,
        position: 'absolute',
        backgroundImage: "url("+require('./assets/Adam_'+sprite+'_16x16.png')+")",
        backgroundPosition: -CHARACTER_WIDTH*sx,
        bottom: position.bottom,
        left: position.left,
        backgroundSize: SPRITE_DIMENSIONS[sprite][0]*SCALE+'px '+ SPRITE_DIMENSIONS[sprite][1]*SCALE +'px'
    }

    const runCharacter = useCallback(()=>{
        if (frame===15) {
            let sx = SPRITE_DIRECTIONS[direction] * 6 + (currentSprite % 6)
            dispatch({type: sprite, direction: direction})
            setSx(sx)
            currentSprite++
            frame = 0
        }
        frame++
        animationFrame = requestAnimationFrame(runCharacter)
    }, [direction, sprite])

    useEffect(()=>{
        setSx(sprite==='idle'? SPRITE_DIRECTIONS[direction]:SPRITE_DIRECTIONS[direction]*6)
        if (sprite==='run') {
            if (!characterMoving) {
                characterMoving = true
                animationFrame = requestAnimationFrame(runCharacter)
            }
        }
    }, [sprite, runCharacter])

    const updateCharacter = function (sprite, key){
        switch (key){
            case 'ArrowLeft':
                setSprite(sprite)
                setDirection('left')
                break;
            case 'ArrowRight':
                setDirection('right')
                setSprite(sprite)
                break;
            case 'ArrowUp':
                setDirection('up')
                setSprite(sprite)
                break;
            case 'ArrowDown':
                setDirection('down')
                setSprite(sprite)
                break;
            default:
                break;
        }
    }

    const handleKeyUp= function (event){
        characterMoving = false
        currentSprite = 0
        if (animationFrame) cancelAnimationFrame(animationFrame)
        updateCharacter('idle', event.key)
    }

    const handleKeyDown= function (event){
        updateCharacter('run', event.key)
    }

    document.addEventListener('keyup', (e) => handleKeyUp(e))
    document.addEventListener('keydown', (e) => handleKeyDown(e))

    return <div style={{backgroundColor: 'red', position: 'relative', width: CONTAINER_WIDTH, height: CONTAINER_HEIGHT}}>
        <div ref={characterRef} style={style}/>
    </div>
}

export default NewCharacter

