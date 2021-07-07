<script>
export default {
  name: 'CommonTimeline',
  props: {
    data: {
      type: Array,
      default: () => ([])
    }
  }
}
</script>

<template lang="pug">
.common-timeline
  .timeline-bar
    el-popover(
      v-for="(item, idx) in data",
      :key="idx",
      popper-class="timeline-popper",
      :width="200",
      trigger="hover",
      placement="right-end",
      :show-arrow="false"
    )
      template(#reference)
        .event-node-container
          .event-node
          .number-bar(:class="idx % 2 ? '' : 'downwards'")
            .node-text {{ idx > 8 ? idx + 1 : `0${idx + 1}`}}
      .timeline-node-info
        .person-name {{ item.name }}
        .event-time {{ item.time }}
        .event-desc {{ item.description }}
    .empty-node
</template>

<style lang="scss">
.timeline-popper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 8px 12px !important;
  background: #081A30 !important;
  border: 1px solid #4DD1FF !important;
  box-shadow: 0px 2px 8px rgba(106, 223, 175, 0.45) !important;
  border-radius: 4px !important;
  .timeline-node-info {
    color: #4DD1FF;
    display: flex;
    flex-direction: column;
    .event-desc {
      color: #BFBFBF;
    }
  }
}

.common-timeline {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .timeline-bar {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    width: calc(100% - 40px);
    height: 8px;
    border-radius: 8px;
    background: linear-gradient(270deg, rgba(34, 165, 183, 0) 0%, #3FCFD7 33.57%, #5BCEFB 100%);
  }
  .event-node-container {
    position: relative;
    cursor: pointer;
    margin-left: -15px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    border-radius: 50%;
    width: 30px;
    border: 1px solid rgba(49, 251, 251, 0.1);
    background: rgba(49, 251, 251, 0.4);
    box-shadow: 0px 0px 4px 1px rgba(170, 255, 240, 0.55);
    .event-node {
      height: 16px;
      width: 16px;
      border-radius: 50%;
      background: #31FBFB;
      box-shadow: 0px 0px 8px 2px rgba(170, 255, 240, 0.5);
    }
    .number-bar {
      font-family: YouSheBiaoTiHei;
      position: absolute;
      top: -30px;
      width: 4px;
      height: 24px;
      background: linear-gradient(180deg, #4DFFDF 0%, rgba(77, 161, 255, 0) 100%);
      border-radius: 4px;
      .node-text {
        color: #31FBFB;
        position: absolute;
        letter-spacing: 0.05em;
        top: -35px;
        left: -14px;
        font-size: 24px;
      }
      &.downwards {
        transform: matrix(1, 0, 0, -1, 0, 0);
        top: 30px;
        .node-text {
          transform: matrix(1, 0, 0, -1, 0, 0);
        }
      }
    }
    &:hover {
      background: rgba(255, 207, 95, 0.6);
      border: 1px solid rgba(255, 207, 95, 0.6);
      box-shadow: 0px 0px 4px 1px rgba(170, 255, 240, 0.55);
      .event-node {
        background: #FFCF5F;
        box-shadow: 0px 0px 8px 2px rgba(170, 255, 240, 0.5);
      }
      .number-bar {
        background: linear-gradient(180deg, #FFD422 0%, rgba(255, 212, 34, 0) 100%);
        .node-text {
          color: #FFCF5F;
        }
      }
    }
  }
}
</style>
