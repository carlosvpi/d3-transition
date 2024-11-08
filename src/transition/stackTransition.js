export default function (arcs) {
  return function (element) {
    const ease = element.ease()
    const duration = element.duration()
    const data = []
    arcs.forEach(slice => data.push({ slice, length: slice.data, start: data[data.length - 1]?.end ?? 0, end: (data[data.length - 1]?.end ?? 0) + slice.data }))
    const sum = d3.sum(data, d => d.length)
    const scales = data.map(({ start, end }) => d3.scaleLinear([start/sum, end/sum], [0, 1]))
    element.delay(0)
      .duration(duration)
      .easeVarying((v, i, slices) => t => {
        let variation = scales[i](ease(t))
        if (variation <= 0 && i > 0) {
          d3.select(slices[i]).attr('opacity', 0)
        }
        if (variation > 0) {
          d3.select(slices[i]).attr('opacity', 1)
        }
        if (variation > 1 && i < slices.length - 1) {
          variation = 1
        }
        return variation
      })
      d3.timeout(() => {
        element.nodes().forEach(slice => d3.select(slice).attr('opacity', 1))
      }, duration);
  }
}