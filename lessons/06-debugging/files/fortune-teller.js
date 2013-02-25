/* Fortune Teller . JS */
// You can think of this as an object constructor.
var FortuneTeller = function(fortuneFile, nice) {
  this._fortuneFile = fortuneFile;
  this._nice = nice;
  this._fortunes = [];
  this.init();
};

// You can think of this as a member function of FortuneTeller
FortuneTeller.prototype.init = function() {
  // Fetch the fortuen file
  $.ajax({
    url: this._fortuneFile,
    dataType: "json",
    success: function(data) {
      this._fortunes = data;
    },
    error: function(jqXhr, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
      console.log("The Mysterious Machine has Failed!");
    }
  });
};

// You can think of this as a member function of FortuneTeller
FortuneTeller.prototype.tellFortune = function() {
  _.each(_.shuffle(this._fortunes), function(fortune) {
    if (fortune.kind == "nice") {
      this.displayFortune(fortune);
    }
  });
};

FortuneTeller.prototype.displayFortune = function(fortune) {
  $("#theFortune").html(fortune.text);
};

