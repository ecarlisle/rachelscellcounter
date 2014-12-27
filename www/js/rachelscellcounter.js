var selectedColors = ['#FFF,#000'],
    selectedColor = "#FFF",
    selectedBackgroundColor = "#000",
    selectedIndex = -1,
    selectedGroupName = "";
    $selectedRow = undefined,
    $selectedRadio = undefined;

function addCellGroup() {
  var content = $('#group-row').html();
  $('#cell-count-table').append(content);
  var tableLength = $('#cell-count-table tr').length, 
      rowIndex = tableLength - 1;
  $('#cell-count-table tr').eq(rowIndex).data('groupName','Black_' + rowIndex);
}


function removeCellGroup(obj){
  var $row = $(obj).parent().parent(),
      rowGroup = $row.data('groupName'),
      rowCount = $('#cell-count-table tr').length,
      radioButtons,
      previousColor = selectedColor,
      colorIsSelected = false;


      if (rowGroup != "") {
        $cells = $('.' + rowGroup);
      } 



  if (confirm('Remove cell group?')){
    $cells.remove();
    $row.remove();

    radioButtons = $("input:radio[name='selection']");
    for (var i=0; i < radioButtons.length; i++) {
      if (radioButtons[i].checked === true) {
          colorIsSelected = true;    
          console.log(i);
      }
    }

    console.log(colorIsSelected);

    if (colorIsSelected === false) {
      selectedIndex = -1;
    }
  }
}

function setRowColor(obj) {
  var row = $(obj).parent().parent(),
      rowIndex = $(obj).closest('tr').index(),
      colors = $(obj).val().split(','),
      colorName = $(obj).find('option:selected').text(),
      previousGroupName = selectedGroupName;

  $(row).data('groupName',colorName + '_' + rowIndex);
  
  if (rowIndex-1 === selectedIndex) {
    setSelectedGroup();
  }

  $(row).css({
    'color' : colors[1],
    'background' : colors[0]
  });

  if (previousGroupName !== "") {
    $('.' + previousGroupName).attr('fill',selectedColor);
    $('.' + previousGroupName).attr('class',selectedGroupName);
  }

}

function setSelectedGroup(){
  console.log('New Group Selected');
  var radioButtons = $("input:radio[name='selection']"),
      previousColor = selectedColor; 

  for (var i=0; i < radioButtons.length; i++) {
    if (radioButtons[i].checked === true) {
      selectedIndex = i;
      $selectedRadio = $("input:radio[name='selection']")[selectedIndex];
      $selectedRow = $($selectedRadio).parent().parent();
      selectedColors = $($selectedRow.children()[2]).find('select').val().split(',');
      selectedColor = selectedColors[0];
      selectedBackgroundColor = selectedColors[1];
      selectedGroupName = $selectedRow.data('groupName');
    }
  }
}

function undo() {
  if ($('svg circle').length > 0) {
    $('svg circle').last().remove();
    countCells();
  }
}


$('#cell-svg').click(function(e) {

  if (selectedIndex != -1) {

    var offset = $(this).offset(),
        left = e.clientX - offset.left,
        top = e.clientY - offset.top,
        cell = document.createElementNS('http://www.w3.org/2000/svg','circle');

    cell.setAttribute("cx", left);
    cell.setAttribute("cy", top);
    cell.setAttribute("r", 8);
    cell.setAttribute("fill", selectedColor);
    cell.setAttribute("class",selectedGroupName);

    $('#cell-svg').append(cell);


    countCells();

  }
});

function countCells() {

  var rows = $('#cell-count-table tr');
  for (var i = 1; i < rows.length; i++) {

    var rowClass = rows.eq(i).data('groupName'),
        rowCellCount = $('.' + rowClass).length;
        rows.eq(i).find('td').eq(3).text(rowCellCount);
  }

}


$('#cell-image').on('load',function(){
  $('#cell-image').width($('#image-container').width());
  $('#cell-svg').width($('#cell-image').width());
  $('#cell-svg').height($('#cell-image').height());
});


function showFile() {
  var cellImage = document.querySelector('#cell-image');
  var file = document.querySelector('#image-file').files[0];
  var reader = new FileReader();

  reader.onloadend = function () {
    cellImage.src = reader.result;
  }

  if (file) {
    reader.readAsDataURL(file);
  } else {
    cellImage.src = "";
  }

}
