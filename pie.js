    var width = 900,
      height = 600,
      radius = Math.min(width, height) / 2;
    var div = d3.select("body").append("div").attr("class", "toolTip");
    var color = d3.scale.ordinal()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    var percentageFormat = d3.format("%");
    var arc, pie, svg, tots;
    var sound = new Audio("else/button-46.mp3");
    function startpie(){
     arc = d3.svg.arc()
      .outerRadius(radius - 30)
      .innerRadius(radius - 130);

     pie = d3.layout.pie()
      .sort(null)
      .value(function(d) {
        return d.values;
      });

     svg = d3.select("#pie").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width /1.55 + "," + height / 2 + ")");
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

        tots = d3.sum(data, function(d) { 
            return d.values; 
            });

          data.forEach(function(d) {
                d.percentage = d.values  / tots;
            });

        return myPie(data);
        });
    }

    function entitydisplay() {
          
          d3.csv("data/7500up.csv", function( data) {  
          var data = d3.nest()
          .key(function(d) {
            return d.entityname;
          })
          .rollup(function(d) {
            return d3.sum(d, function(g) {
              return g.amount;
            });
          }).entries(data);
          
          tots = d3.sum(data, function(d) { 
            return d.values; 
            });

          data.forEach(function(d) {
                d.percentage = d.values  / tots;
            });

          return myPie(data);

          });
    }

    function publicdisplay(){
      d3.csv("data/7500up.csv", function( data) {  
          var data = d3.nest()
          .key(function(d) {
            if (d.entity=='pub') {
            return 'Public Donations:';
            }
            else {
              return'Private Donations:';
            }
          
          })
          .rollup(function(d) {
            return d3.sum(d, function(g) {
              return g.amount;
            });
          }).entries(data);
          
          tots = d3.sum(data, function(d) { 
            return d.values; 
            });

          data.forEach(function(d) {
                d.percentage = d.values  / tots;
            });

          return myPie(data);

          });

    }
    
    function amountdisplay(){

        d3.csv("data/7500up.csv", function( data) {  
          var data = d3.nest()
          .key(function(d) {
            if (d.amount <25000) {
              return "Donations up to 25k:";
            }  
            else if(d.amount<50000){
              return "Donations 25-50k:";
            }  
            else if(d.amount<100000){
              return "Donations 50k-100k:";
            }
            else if(d.amount<500000){
              return "Donations 100k-500k:";
            }
            else {
              return "Donations over 500k:";
            }  
          })
          .rollup(function(d) {
            return d3.sum(d, function(g) {
              return g.amount;
            });
          }).entries(data);

          tots = d3.sum(data, function(d) { 
            return d.values; 
            });

          data.forEach(function(d) {
                d.percentage = d.values  / tots;
            });          
          
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
        })
      .on("mouseover", function(d) {

          div.style("left", d3.event.pageX+10+"px");
          div.style("top", d3.event.pageY-25+"px");
          div.style("display", "inline-block"); 
          div.html(percentageFormat(d.data.percentage));
          
          svg.append("text")
            .attr("dy", ".5em")
            .style("text-anchor", "middle")
            .style("font-size", 22)
            .style("font-weight", "bold")
            .attr("class","label")
            .style("fill", function(d,i){return "black";})
            .text( d.data.key +" £" +d.data.values);

          d3.select(this)
          .attr("stroke", "white")
          .style("transform", "scale(1.05)");  
          sound.play();      
      })  
      .on("mouseout", function(d) {
        div.style("display", "none");
        svg.select(".label").remove();
        d3.select(this)
        .attr("stroke", "")
        .style("transform", "scale(1)");
      });

    }

    

    function transition (name) {
      d3.select("#pie").selectAll("*").remove();
      if (name === "group-by-money-source") {
        $("#initial-content").fadeIn(1000);
        $("#partypie").fadeOut(250);
        $("#donorpie").fadeOut(250);
        startpie();
        return entitydisplay();
      }

      if (name ==="group-by-party") {
        //$("#initial-content").fadeOut(250);
        $("#partypie").fadeIn(1000);
        $("#donorpie").fadeOut(250);
        startpie();
        return partydisplay();
      }
      if (name ==="group-by-public") {
        //$("#initial-content").fadeOut(250);
        $("#partypie").fadeOut(1000);
        $("#donorpie").fadeOut(250);
        startpie();
        return publicdisplay();
      }      
      if (name === "group-by-amount") {
        //$("#initial-content").fadeOut(250);
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
