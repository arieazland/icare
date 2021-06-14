document.getElementById("tambahpertanyaan").onclick = function() {
    var container = document.getElementById("form-group");
    var section = document.getElementById("pertanyaan");
    container.appendChild(section.cloneNode(true));
  }