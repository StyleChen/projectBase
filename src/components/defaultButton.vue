<template>
  <button :form="form" :class="['default_btn', className, { default_btn_over: isOver }]" @mouseover="defaultBtnOver" @mouseout="defaultBtnOver" @click="clickfunc" :disabled="disabled">{{text}}</button>
</template>
<script>
export default {
  name: 'default-button',
  // props: ['text', 'clickfunc', 'class-name', 'disabled'],
  props: {
    text: {
      required: true
    },
    clickfunc: {
      default: () => {}
    },
    className: {
      default: ''
    },
    disabled: {
      default: false
    },
    form: {
      default: ''
    }
  },
  data () {
    return {
      isOver: false
    }
  },
  methods: {
    defaultBtnOver () {
      this.isOver = !this.isOver
    }
  }
}
</script>
<style scoped>
.default_btn {
  cursor: pointer;
  outline: none;
  border: none;
  height: 36px;
  background:rgba(153,211,255,1);
  border-radius:2px;
  line-height: 36px;
  font-size: 14px;
  font-family:SourceHanSansSC-Medium;
  font-weight:500;
  color:rgba(255,254,254,1);
  padding: 0 37px;
  margin-right: 25px;
}
.default_btn:hover {
  background:rgba(63,171,254,1);
  color:rgba(255,254,254,1);
}
.default_btn:active {
  background:rgba(53,146,225,1);
  color:rgba(255,255,255,1);
}
button:disabled {
  /* background-color: #666; */
  cursor: not-allowed;
}
/* .default_btn:disabled:hover{
  background: #666;
  box-shadow: none;
  color: #11C6A0;
} */
</style>
