<template>
  <div class="loading">
    <span class="material-icons-outlined loading-icon"> refresh </span>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.loading {
  display: flex;
  justify-content: center;
  .loading-icon {
    font-size: 30px;
    animation: rotating-icon 1s linear 0s infinite;
  }
}

// https://developer.mozilla.org/ko/docs/Web/CSS/CSS_Animations/Using_CSS_animations
@keyframes rotating-icon {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
