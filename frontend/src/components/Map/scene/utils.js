export const genTooltip = (map, options = {}) => {
  const text = new window.AMap.Text({
    text: '纯文本标记',
    anchor: 'center',
    draggable: true,
    cursor: 'pointer',
    angle: 0,
    visible: false,
    offset: [0, -60],
    style: {
      padding: '8px 12px',
      'margin-bottom': '1rem',
      'border-radius': '.25rem',
      'background-color': '#081A30',
      width: 'auto',
      'border-width': 0,
      'box-shadow': '0 2px 6px 0 rgba(255, 255, 255, .3)',
      'text-align': 'left',
      'font-size': '14px',
      color: '#D9D9D9'
    },
    ...options
  })
  text.setMap(map)
  return text
}
