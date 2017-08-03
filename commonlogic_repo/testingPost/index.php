
<!DOCTYPE html>
<html>
<head>
	<title>Test Post</title>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">
</head>
<body>
<div class="content-fluid" style="margin: 40px">
	<center>
	<h1>
		Envío de POST simulando medición de dispositivo.
	</h1>	
	</center> 

  <br>
  <br>	
  <center>
  	
<form action="http://192.168.1.102/commonlogic_repo/backend/public/medir" method="POST" class="col-md-9">
<div class="form-group row">
  <label for="dispositivo_id" class="col-2 col-form-label">ID Dispositivo: </label>
  <div class="col-10">
    <input class="form-control" type="number" name="dispositivo_id" id="dispositivo_id" required>
  </div>
</div>
 <input class="form-control" value="3odUw2kewV" type="text" name="token" id="token" hidden>
<div class="form-group row">
  <label for="var1" class="col-2 col-form-label">Variable 1: </label>
  <div class="col-10">
    <input class="form-control" type="number" name="var1" id="var1">
  </div>
</div>
<div class="form-group row">
  <label for="var2" class="col-2 col-form-label">Variable 2: </label>
  <div class="col-10">
    <input class="form-control" type="number" name="var2" id="var2">
  </div>
</div>
<div class="form-group row">
  <label for="var3" class="col-2 col-form-label">Variable 3: </label>
  <div class="col-10">
    <input class="form-control" type="number" name="var3" id="var3">
  </div>
</div>
<div class="form-group row">
  <label for="var4" class="col-2 col-form-label">Variable 4: </label>
  <div class="col-10">
    <input class="form-control" type="number" name="var4" id="var4">
  </div>
</div>
<div class="form-group row">
  <label for="var5" class="col-2 col-form-label">Variable 5: </label>
  <div class="col-10">
    <input class="form-control" type="number" name="var5" id="var5">
  </div>
  <br>
  <br>
  <hr>
  <button class="btn btn-primary btn-block" type="submit">Enviar</button>
</form>
  </center>
</div>
</div>
<script src="https://code.jquery.com/jquery-3.1.1.slim.min.js" integrity="sha384-A7FZj7v+d/sdmMqp/nOQwliLvUsJfDHW+k9Omg/a/EheAdgtzNs3hpfag6Ed950n" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn" crossorigin="anonymous"></script>
</body>
</html>
