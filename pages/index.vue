<template>
  <div class="index_panal flex items-center justify-center">
    <img :src="counter.setting.logo" class="w-10 mr-2" alt="" />
    <h1 class="mr-2 text-black font-bold">
      {{ counter.setting.title }}
    </h1>
    <div class="loaders" title="3">
      <svg
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        width="24px"
        height="30px"
        viewBox="0 0 24 30"
        style="enable-background: new 0 0 50 50"
        xml:space="preserve"
      >
        <rect x="0" y="10" width="4" height="10" fill="#333" opacity="0.2">
          <animate
            attributeName="opacity"
            attributeType="XML"
            values="0.2; 1; .2"
            begin="0s"
            dur="0.6s"
            repeatCount="indefinite"
          ></animate>
          <animate
            attributeName="height"
            attributeType="XML"
            values="10; 20; 10"
            begin="0s"
            dur="0.6s"
            repeatCount="indefinite"
          ></animate>
          <animate
            attributeName="y"
            attributeType="XML"
            values="10; 5; 10"
            begin="0s"
            dur="0.6s"
            repeatCount="indefinite"
          ></animate>
        </rect>
        <rect x="8" y="10" width="4" height="10" fill="#333" opacity="0.2">
          <animate
            attributeName="opacity"
            attributeType="XML"
            values="0.2; 1; .2"
            begin="0.15s"
            dur="0.6s"
            repeatCount="indefinite"
          ></animate>
          <animate
            attributeName="height"
            attributeType="XML"
            values="10; 20; 10"
            begin="0.15s"
            dur="0.6s"
            repeatCount="indefinite"
          ></animate>
          <animate
            attributeName="y"
            attributeType="XML"
            values="10; 5; 10"
            begin="0.15s"
            dur="0.6s"
            repeatCount="indefinite"
          ></animate>
        </rect>
        <rect x="16" y="10" width="4" height="10" fill="#333" opacity="0.2">
          <animate
            attributeName="opacity"
            attributeType="XML"
            values="0.2; 1; .2"
            begin="0.3s"
            dur="0.6s"
            repeatCount="indefinite"
          ></animate>
          <animate
            attributeName="height"
            attributeType="XML"
            values="10; 20; 10"
            begin="0.3s"
            dur="0.6s"
            repeatCount="indefinite"
          ></animate>
          <animate
            attributeName="y"
            attributeType="XML"
            values="10; 5; 10"
            begin="0.3s"
            dur="0.6s"
            repeatCount="indefinite"
          ></animate>
        </rect>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});
import { ref } from "vue";
import { useCounter } from "~/store/counter";
import { Message } from "@arco-design/web-vue";
const counter = useCounter();
const router = useRouter();
const token = useCookie("token");
const get_config = () => {
  get_nav_config()
    .then((res: any) => {
      counter.setting = res._rawValue.data;
      if (res._rawValue.data.is_must_login == "1" && !token.value) {
        router.push("/login");
      } else {
        router.push(res._rawValue.data.portal_normal);
      }
    })
    .catch((err: any) => {
      Message.error(err);
    });
};
get_config();
useHead({
  title: counter.setting.title,
  meta: [
    { name: "description", content: counter.setting.description },
    { name: "keywords", content: counter.setting.keywords },
  ],
});
</script>

<style lang="scss">
.bg_loading {
  width: 100%;
  position: absolute;
  height: 100vh;
  z-index: 9;
  background-image: linear-gradient(
    135deg,
    rgb(153, 210, 228) 0%,
    rgb(255, 212, 218) 100%
  );
  background-size: 400%;
  background-position: 0% 100%;
  -webkit-animation: gradient 7.5s ease-in-out infinite;
  animation: gradient 7.5s ease-in-out infinite;
  h1 {
    font-size: 26px;
    display: block;
    text-align: center;
    color: #fff;
    padding: 50px 20px;
    font-weight: 300;
    font-family: "Archivo Narrow", sans-serif;
  }
}
@-webkit-keyframes gradient {
  50% {
    background-position: 100% 0;
  }
}
@keyframes gradient {
  50% {
    background-position: 100% 0;
  }
}
@-webkit-keyframes img {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(-360deg);
  }
}
@keyframes img {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(-360deg);
    transform: rotate(-360deg);
  }
}
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@-webkit-keyframes spin-reverse {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(-360deg);
  }
}
@keyframes spin-reverse {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(-360deg);
    transform: rotate(-360deg);
  }
}
//custom mixins
@mixin transform($transform) {
  -webkit-transform: $transform;
  -moz-transform: $transform;
  transform: $transform;
}
@mixin animation($animation) {
  -webkit-animation: $animation;
  -moz-animation: $animation;
  animation: $animation;
}
@mixin keyframes($name, $name1) {
  @-webkit-keyframes #{$name} {
    @content;
  }
  @-moz-keyframes #{$name} {
    @content;
  }
  @-ms-keyframes #{$name} {
    @content;
  }
  @keyframes #{$name} {
    @content;
  }
}
@mixin opacity($opacity) {
  -webkit-opacity: $opacity;
  -moz-opacity: $opacity;
  opacity: $opacity;
}
@mixin border-radius($radius) {
  -webkit-border-radius: $radius;
  -moz-border-radius: $radius;
  border-radius: $radius;
}

//variables
$size: 100px;
$primary-color: white;

//cube only
.cube-folding {
  width: $size;
  height: $size;
  display: inline-block;
  @include transform(rotate(45deg));
  font-size: 0;
  span {
    position: relative;
    width: calc($size/2);
    height: calc($size/2);
    @include transform(scale(1.1));
    display: inline-block;
    &::before {
      content: "";
      background-color: $primary-color;
      position: absolute;
      left: 0;
      top: 0;
      display: block;
      width: calc($size/2);
      height: calc($size/2);
      -moz-transform-origin: 100% 100%;
      -ms-transform-origin: 100% 100%;
      -webkit-transform-origin: 100% 100%;
      transform-origin: 100% 100%;
      @include animation(folding 2.5s infinite linear both);
    }
  }
  .leaf2 {
    @include transform(rotateZ(90deg) scale(1.1));
    &::before {
      -webkit-animation-delay: 0.3s;
      animation-delay: 0.3s;
      background-color: darken($primary-color, 5%);
    }
  }
  .leaf3 {
    @include transform(rotateZ(270deg) scale(1.1));
    &::before {
      -webkit-animation-delay: 0.9s;
      animation-delay: 0.9s;
      background-color: darken($primary-color, 5%);
    }
  }
  .leaf4 {
    @include transform(rotateZ(180deg) scale(1.1));
    &::before {
      -webkit-animation-delay: 0.6s;
      animation-delay: 0.6s;
      background-color: darken($primary-color, 10%);
    }
  }
}

//animation
@include keyframes(folding, folding animation) {
  0%,
  10% {
    @include transform(perspective(140px) rotateX(-180deg));
    @include opacity(0);
  }
  25%,
  75% {
    @include transform(perspective(140px) rotateX(0deg));
    @include opacity(1);
  }
  90%,
  100% {
    @include transform(perspective(140px) rotateY(180deg));
    @include opacity(0);
  }
}

//with loading text and shadow
.cube-wrapper {
  position: fixed;
  left: 50%;
  top: 50%;
  margin-top: -$size;
  margin-left: -$size;
  width: $size * 2;
  height: $size * 2;
  text-align: center;

  //shadow
  &:after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -20px;
    margin: auto;
    width: $size * 1.8;
    height: 6px;
    z-index: 1;
    background-color: rgba(black, 0.1);
    -webkit-filter: blur(2px);
    filter: blur(2px);
    @include border-radius(100%);
    @include animation(shadow 0.5s ease infinite alternate);
  }
  .loading {
    font-size: 15px;
    letter-spacing: 0.1em;
    display: block;
    color: $primary-color;
    position: relative;
    top: calc($size/2);
    z-index: 2;
    @include animation(text 0.5s ease infinite alternate);
  }
}
@include keyframes(text, text animation) {
  100% {
    top: calc($size/2) + 10;
  }
}
@include keyframes(shadow, shadow animation) {
  100% {
    bottom: -18px;
    width: calc($size * 2);
  }
}

////page styles
</style>
