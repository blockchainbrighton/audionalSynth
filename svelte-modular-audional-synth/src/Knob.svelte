<div class="knob-control" style="{style}" bind:this={knob}>
    <div class='knob-container'>
        <!-- The shadow and knob elements are positioned absolutely within the container -->
        <div class='knob-shadow'></div>
        <div class='knob' id="knob">
            <!-- The indicator is a child of the knob and positioned absolutely at the top -->
            <div class='indicator'></div>
        </div>
        <div class='scale'>
            <!-- The scale is positioned absolutely at the bottom of the container -->
            <span class='min'>0</span>
            <span class='max'>10</span>
        </div>

        <!-- The SVG can be kept if it's needed for the knob's functionality -->
        <svg width="{computedSize}" height="{computedSize}" viewBox="0 0 100 100"
            on:click="{onClick}"
            on:mousedown="{onMouseDown}"
            on:mouseup="{onMouseUp}"
            on:touchstart="{onTouchStart}"
            on:touchend="{onTouchEnd}">
            {#if showValue}
            <path
                d="{valuePath}"
                stroke-width="{strokeWidth}"
                stroke="{primaryColor}"
                bind:this={pathValue}
                data-dash="{length}"
                style="{dashStyle}"
                class="knob-control__value">
            </path>
            <text
                x="50"
                y="57"
                text-anchor="middle"
                fill="{textColor}"
                class="knob-control__text-display">
                {valueDisplay}
            </text>
            {/if}
        </svg>
    </div>
</div>

<script>
import {
    onMount
} from 'svelte'

const RADIUS = 40;
const MID_X = 50;
const MID_Y = 50;
const MIN_RADIANS = 4 * Math.PI / 3;
const MAX_RADIANS = -Math.PI / 3;

let pathValue;
let knob;

let length = 0;
let animatedValue = 0;
let interval = null;

export let animation = {
    animated: false,
    animateValue: false,
    animationDuration: 2000,
    animationFunction: 'ease-in-out',
}

export let value = 0;
export let max = 100;
export let min = 0;
export let showValue = true;

export let disabled = false;
export let step = 1;
export let size = 100;
export let responsive = false;
export let primaryColor = '#409eff';
export let secondaryColor = '#dcdfe6';
export let textColor = '#000000';
export let strokeWidth = 17;
export let valueDisplayFunction = (v) => v;

onMount(async () => {
    dashLength()
    clearInterval(interval);
  
    interval = null;
    if (animation.animateValue) {
        interval = setInterval(() => {
            if (animatedValue < value) {
                animatedValue += 1;
            } else {
                clearInterval(interval);
                interval = null;
            }
        }, (animation.animationDuration * 1000) / value / 1000);
    }
});

$: dashStyle = {
    strokeDasharray: length,
    strokeDashoffset: length
}

$: style = 'height:' + (responsive ? size + '%' : size - 5 + 'px');

$: computedSize = responsive ? size + '%' : size

$: rangePath = `M ${minX} ${minY} A ${RADIUS} ${RADIUS} 0 1 1 ${maxX} ${maxY}`;

$: valuePath = `M ${zeroX} ${zeroY} A ${RADIUS} ${RADIUS} 0 ${largeArc} ${sweep} ${valueX} ${valueY}`;


$: zeroRadians = (min > 0 && max > 0) ?mapRange(min, min, max, MIN_RADIANS, MAX_RADIANS):mapRange(0, min, max, MIN_RADIANS, MAX_RADIANS);

$: valueRadians = mapRange(value, min, max, MIN_RADIANS, MAX_RADIANS);

$: minX = MID_X + Math.cos(MIN_RADIANS) * RADIUS;

$: minY = MID_Y - Math.sin(MIN_RADIANS) * RADIUS;

$: maxX = MID_X + Math.cos(MAX_RADIANS) * RADIUS;

$: maxY = MID_Y - Math.sin(MAX_RADIANS) * RADIUS;

$: zeroX = MID_X + Math.cos(zeroRadians) * RADIUS;

$: zeroY =MID_Y - Math.sin(zeroRadians) * RADIUS;

$: valueX =MID_X + Math.cos(valueRadians) * RADIUS;

$: valueY = MID_Y - Math.sin(valueRadians) * RADIUS;

$: largeArc = Math.abs(zeroRadians - valueRadians) < Math.PI ? 0 : 1;

$: sweep = valueRadians > zeroRadians ? 0 : 1;

$: valueDisplay = animation.animateValue ? valueDisplayFunction(animatedValue):valueDisplayFunction(value);


let isUpdating = false;

let lastUpdateTimestamp = 0;
const MAX_RATE_OF_CHANGE = 1; // Maximum units the value can change per update
const UPDATE_INTERVAL_MS = 10; // Minimum time interval between updates in milliseconds

const INTERACTIVE_RADIUS = size / 2; // Set the interactive radius to half the size of the knob for a wide area

function updatePosition(clientX, clientY) {
    const knobRect = knob.getBoundingClientRect();
    const knobCenterX = knobRect.left + knobRect.width / 2;
    const knobCenterY = knobRect.top + knobRect.height / 2;

    const dx = clientX - knobCenterX;
    const dy = knobCenterY - clientY;
    const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);

    // Only update if within the interactive radius
    if (distanceFromCenter <= INTERACTIVE_RADIUS) {
        const angle = Math.atan2(dy, dx);


    let mappedValue;

    const start = -Math.PI / 2 - Math.PI / 6;

    if (angle > MAX_RADIANS) {
        mappedValue = mapRange(angle, MIN_RADIANS, MAX_RADIANS, min, max);
    } else if (angle < start) {
        mappedValue = mapRange(angle + 2 * Math.PI, MIN_RADIANS, MAX_RADIANS, min, max);
    } else {
        return;
    }

    // Calculate the rate-limited value change
    const newValue = Math.round((mappedValue - min) / step) * step + min;
    const valueChange = newValue - value;
    if (Math.abs(valueChange) > MAX_RATE_OF_CHANGE) {
        value += (valueChange > 0 ? MAX_RATE_OF_CHANGE : -MAX_RATE_OF_CHANGE);
    } else {
        value = newValue;
    }
}

function onClick(e) {
 
    if (!disabled) {
   
        updatePosition(e.offsetX, e.offsetY);
    }
};

function onMouseDown(e) {
    if (!disabled) {
        e.preventDefault();
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    }
};

function onMouseUp(e) {
    if (!disabled) {
        e.preventDefault();
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        isUpdating = false; // Ensure we reset the updating flag
    }
};

function onTouchStart(e) {
    if (!disabled) {
        e.preventDefault();
        window.addEventListener('touchmove', onTouchMove);
        window.addEventListener('touchend', onTouchEnd);
    }
};

function onTouchEnd(e) {
    if (!disabled) {
        e.preventDefault();
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onTouchEnd);
        isUpdating = false; // Ensure we reset the updating flag
    }
};

function onMouseMove(e) {
    if (!disabled) {
        e.preventDefault();
        updatePosition(e.clientX, e.clientY);
    }
}


function onTouchMove(e) {
    if (!disabled && e.touches.length == 1) {
        const touch = e.touches[0];
        updatePosition(touch.clientX, touch.clientY);
    }
}
function dashLength() {
   
    let element = pathValue;
    let length = element.getTotalLength()
    if (animation.animated) {
        element.style.animationDuration = (animation.animationDuration / 1000) + 's'
        element.style.animationFunction = animation.animationFunction
    }
    element.dataset.dash = length
    length = length
};

function mapRange(x, inMin, inMax, outMin, outMax)  {
    return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
};

</script>

<style>
@keyframes dash-frame {
    100% {
        stroke-dashoffset: 0;
    }
}

.knob-control__range {
    fill: none;
    transition: stroke .1s ease-in;
}

.knob-control__value {
    animation-name: dash-frame;
    animation-fill-mode: forwards;
    fill: none;
}

.knob-control__text-display {
    font-size: 1.3rem;
    text-align: center;
}

.knob-container {
            position: relative;
            width: 100px;
            height: 100px;
            user-select: none;
        }

        .knob-shadow {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            box-shadow: 5px 5px 10px #bebebe, -5px -5px 10px #ffffff;
            position: absolute;
            top: 10px;
            left: 10px;
        }

        .knob {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: linear-gradient(145deg, #f0f0f0, #bebebe);
            position: absolute;
            top: 10px;
            left: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transform: rotate(240deg); /* Initial position at 8 o'clock */
        }

        .indicator {
            width: 10px;
            height: 2px;
            background-color: black;
            position: absolute;
            top: 5px;
        }

        .scale {
            position: absolute;
            width: 100%;
            top: 90px;
            text-align: center;
            font-size: 14px;
        }

        .scale .min {
            position: absolute;
            left: 10px;
        }

        .scale .max {
            position: absolute;
            right: 10px;
        }
</style>