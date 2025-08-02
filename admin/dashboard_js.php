<script>

$(document).ready(function(){

  var response = <?php echo $_SESSION['all_customer_accounts'] ?>;
  
  $('#all_customer_accounts').empty();
  $('#all_customer_accounts').append(parse_json(response));

  response = <?php echo $_SESSION['count_customers'] ?>;
  $('#count_customers').empty();
  $('#count_customers').append('<h2>'+response+'</h2>');

  response = <?php echo $_SESSION['count_employees'] ?>;
  $('#count_employees').empty();
  $('#count_employees').append('<h2>'+response+'</h2>');

  response = <?php echo $_SESSION['count_administrators'] ?>;
  $('#count_administrators').empty();
  $('#count_administrators').append('<h2>'+response+'</h2>');

  response = <?php echo $_SESSION['count_offices'] ?>;
  $('#count_offices').empty();
  $('#count_offices').append('<h2>'+response+'</h2>');
  
});

function parse_json (data) {
  var table = '<table>';
  var thead = '<thead><tr>';
  var i = 0;

  $(data[0]).each(function(ind_cell, val_cell) { 
    thead += "<th>" + val_cell + "</th>";
    i++;
  });

  thead += '</tr></thead>';
  table += thead;
  var row = '<tbody>';
  var col = '';
  i = 0;

  $(data).each(function(index, element) { 
    if (i > 0){
      row += '<tr>';
      col = '';

      $(element).each(function(ind_cell, val_cell) {
        col += "<td><p>" + val_cell + "</p></td>";
      })

      row += col;
      row += '</tr>';
    }
    i++;
  });
  
  row += '</tbody>';
  table += row;
  table += '</table>';
  return table;
}

</script>