<template>
  <div class="ping">
    <div class="inputs">
      <el-input v-model="ip1" placeholder="请输入源ip地址"></el-input>
      <el-input v-model="ip2" placeholder="请输入目的ip地址"></el-input>
    </div>
    <div class="btn">
      <el-button :loading="loading" type="primary" @click="postPing"
        >获取最优路径</el-button
      >
    </div>
    <div class="result"></div>
    <div class="delay">
      <h1 class="delay-title">时延信息表</h1>
      <el-table :data="links" height="500" style="width: 100%">
        <el-table-column prop="source.id" label="源ip"></el-table-column>
        <el-table-column prop="target.id" label="目的ip"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import axios from "axios";
export default {
  data() {
    return {
      ip1: "",
      ip2: "",
      links: [],
      loading: false,
      width: 1200,
      height: 600,
    };
  },
  methods: {
    postPing() {
      this.$data.loading = true;
      document.querySelector(".result").innerHTML = "";
      axios
        .post("http://210.41.99.31:88/bestpath", {
          ip1: this.$data.ip1,
          ip2: this.$data.ip2,
        })
        .then((res) => {
          console.log(res);
          this.$data.loading = false;
          // console.log(res);
          this.$data.links = res.data.links;
          this.$data.nodes = res.data.nodes;
          document.querySelector(".result").append(this.chart());
        });
    },
    // 图表
    chart() {
      const links = this.$data.links.map((d) => Object.create(d));
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
        .attr("stroke-width", 1.5);

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
      // .join("text");

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
  },
  updated() {
    // document.querySelector(".result").append(this.chart());
  },
};
</script>

<style scoped>
.ping {
  width: 100%;
}
.inputs {
  width: 50%;
  margin-top: 20px;
}
.inputs * {
  margin-top: 10px;
}
.btn {
  margin-top: 20px;
}
.result {
  min-height: 600px;
}
.delay-title {
  text-align: center;
}
</style>
