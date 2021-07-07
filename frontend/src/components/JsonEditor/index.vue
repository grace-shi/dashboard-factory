<script>
import 'jsoneditor/dist/jsoneditor.min.css'
import JsonEditor from 'jsoneditor'

export default {
  name: 'json-editor',
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    mode: {
      type: String,
      default: 'code'
    },
    modes: {
      type: Array,
      default: () => (['tree', 'code', 'form', 'text', 'view'])
    }
  },
  data () {
    return {
      isError: false,
      editor: null,
      error: false,
      internalChange: false
    }
  },
  methods: {
    async setEditor (value) {
      if (this.editor) {
        this.editor.set(value)
      }
    },
    jsonChange (value) {
      this.isError = false
      console.log('jsonChange', value)
      this.$emit('jsonChange', value)
    },
    hasError (value) {
      if (value) {
        this.isError = true
      }
    }
  },
  watch: {
    isError (val) {
      this.$emit('getError', val)
    },
    data: {
      immediate: true,
      async handler (val) {
        if (!this.internalChange) {
          await this.setEditor(val)
        }
      },
      deep: true
    },
    mode (val) {
      if (this.editor && this.modes.includes(val)) {
        this.editor.setMode(val)
      }
    }
  },
  beforeUnmount () {
    if (this.editor) {
      this.editor.destroy()
    }
  },
  mounted () {
    const self = this
    const { mode, modes } = this
    const options = {
      mode,
      modes,
      enableTransform: false,
      onChange () {
        try {
          const json = self.editor.get()
          console.log('json', json)
          // eslint-disable-next-line vue/no-mutating-props
          // self.data = json
          self.jsonChange(json)
          self.internalChange = true
          self.$nextTick(() => {
            self.internalChange = false
          })
        } catch (e) {
          self.hasError(e)
        }
      }
    }

    this.editor = new JsonEditor(
      this.$el.querySelector('#jsonEditor'),
      options,
      this.data
    )
  }
}
</script>

<template lang="pug">
.custom-json-editor
  #jsonEditor
  small.text-danger(v-show="isError") * 格式不正确，请重新输入！如需清空，请填写{}
</template>

<style lang="scss">
.custom-json-editor {
  margin-bottom: 1rem;
  #jsonEditor {
    height: 80vh;
    .jsoneditor {
      height: 100%;
    }
    .jsoneditor-menu {
      .jsoneditor-poweredBy,
      .jsoneditor-repair {
        display: none;
      }
    }

    .jsoneditor-outer {
      min-height: 80vh;
    }
  }

  code {
    background-color: #f5f5f5;
  }
}
</style>
