<template>
  <div class="topoPage">
    <div class="btn">
      <el-button type="primary" :loading="loading" @click="refreshTopo"
        >获取拓扑</el-button
      >
    </div>
    <div class="topo">
      <h1>请点击按钮获取拓扑图</h1>
    </div>
    <div class="delay">
      <h1 class="delay-title">时延信息表</h1>
      <el-table :data="links" height="500" style="width: 100%">
        <el-table-column prop="source.id" label="源ip"></el-table-column>
        <el-table-column prop="target.id" label="目的ip"></el-table-column>
        <el-table-column prop="value" label="时延"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import * as d3 from "d3";
export default {
  data() {
    return {
      links: [],
      nodes: [],
      width: 1200,
      height: 600,
      loading: false,
    };
  },
  methods: {
    // 图表
    chart() {
      var defaultLinks = this.$data.links;
      const links = defaultLinks.map((d) => Object.create(d));
      const nodes = this.$data.nodes.map((d) => Object.create(d));
      const width = this.$data.width;
      const height = this.$data.height;

      const simulation = d3
        .forceSimulation(nodes)
        .force(
          "link",
          d3.forceLink(links).id((d) => d.id)
        )
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

      const svg = d3
        .create("svg")
        .attr("viewBox", [0, 0, width, height])
        .style("font", "12px sans-serif");

      const link = svg
        .append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", (d) => Math.sqrt(d.value));

      const node = svg
        .append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", 5)
        .attr("fill", this.color)
        .call(this.drag(simulation));

      node
        .append("title")
        .attr("x", 8)
        .attr("y", "0.31em")
        .text((d) => d.id);
      // .join("title");

      simulation.on("tick", () => {
        link
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);

        node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
      });

      // invalidation.then(() => simulation.stop());

      return svg.node();
    },
    // 颜色
    color() {
      const scale = d3.scaleOrdinal(d3.schemeCategory10);
      return (d) => scale(d.group);
    },
    // 拖拽
    drag(simulation) {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    },
    getTopo() {
      axios
        .get(
          "https://www.fastmock.site/mock/2f97da4b636ec930d010ddf4c9415f84/sdn/sdn/getTopo"
        )
        .then((res) => {
          console.log(res.data.data.links);
          this.$data.links = res.data.data.links;
          console.log(this.$data.links);
          this.$data.nodes = res.data.data.nodes;
          const chart = this.chart();
          console.log(chart);
          this.$data.chart = chart;
          document.querySelector(".topo").append(this.$data.chart);
          this.$data.loading = false;
        });
    },
    refreshTopo() {
      this.$data.loading = true;
      document.querySelector(".topo").innerHTML = "";
      this.getTopo();
    },
  },
};
</script>

<style scoped>
.topo {
  min-height: 600px;
}
.topo svg {
  width: 100%;
  height: 70%;
}
.delay-title {
  text-align: center;
}
</style>
