    var width = 1100,
      height = 500,
      radius = Math.min(width, height) / 2;

    var color = d3.scale.ordinal()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

      var arc, pie, svg;
    function startpie(){
     arc = d3.svg.arc()
      .outerRadius(radius - 10)
      .innerRadius(radius - 120);

     pie = d3.layout.pie()
      .sort(null)
      .value(function(d) {
        return d.values;
      });

     svg = d3.select("#pie").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width /1.45 + "," + height / 2 + ")");
     } 

    // d3.csv("data/7500up.csv", function(error, data) {
    
    // });

    function partydisplay () {
        d3.csv("data/7500up.csv", function( data) {
        var data = d3.nest()
        .key(function(d) {
          return d.partyname;
        })
        .rollup(function(d) {
          return d3.sum(d, function(g) {
            return g.amount;
          });
        }).entries(data);
        return myPie(data);
        });
    }

    function entitydisplay() {
          
          d3.csv("data/7500up.csv", function( data) {  
          var data = d3.nest()
          .key(function(d) {
            return d.entity;
          })
          .rollup(function(d) {
            return d3.sum(d, function(g) {
              return g.amount;
            });
          }).entries(data);
          
          return myPie(data);

          });
    }
    
    function amountdisplay(){

        d3.csv("data/7500up.csv", function( data) {  
          var data = d3.nest()
          .key(function(d) {
            return d.entity;
          })
          .rollup(function(d) {
            return d3.sum(d, function(g) {
              return g.amount;
            });
          }).entries(data);
          
          return myPie(data);

          });

    }

    

    function myPie(data) {
      var g = svg.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc")
        .attr("id", "mychart");
        

      g.append("path")
        .attr("d", arc)
        .style("fill", function(d) {

          return color(d.data.key);
        });

      g.append("text")
        .attr("transform", function(d) {
          return "translate(" + arc.centroid(d) + ")";
        })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text(function(d) {
          return d.data.key ;
        })
      g.append("text")
        .attr("transform", function(d) {
          return "translate(" + arc.centroid(d) + ")";
        })
        .attr("dy", "1.60em")
        .style("text-anchor", "middle")
        .text(function(d) {
          console.log(d.data);
          return "£ " + d.data.values ;
        });

    }

    

    function transition (name) {
      d3.select("#pie").selectAll("*").remove();
      if (name === "group-by-money-source") {
        $("#entitypie").fadeIn(1000);
        $("#partypie").fadeOut(250);
        $("#donorpie").fadeOut(250);
        startpie();
        return entitydisplay();
      }

      if (name ==="group-by-party") {
        $("#entitypie").fadeOut(250);
        $("#partypie").fadeIn(1000);
        $("#donorpie").fadeOut(250);
        startpie();
        return partydisplay();
      }
      if (name === "group-by-donor-type") {
        $("#entitypie").fadeOut(250);
        $("#partypie").fadeOut(250);
        $("#donorpie").fadeIn(1000);
         //removes half of the pie :/
        startpie();
        return amountdisplay();
      }
    }
    

    $(document).ready(function() {
          startpie();
      entitydisplay();    
    d3.selectAll(".switch").on("click", function(d) {
      var id = d3.select(this).attr("id");
      return transition(id);

    });

});
