<!DOCTYPE html>
<html>
<head>
  <title>Email</title>
</head>
<body>

    <div style="max-width:650px;text-align:center;background-color:#f8f8f8;font-family: 'Montserrat', sans-serif;color:#1a1a1a;">

        <div style="padding:100px;text-align:left;">

            <p>Hola <strong>{{ $fullname }}</strong>, ingresá en el siguiente enlace para cambiar tu contraseña: <br>
              <a href="{{ $link = url('password/reset'.'?token='.$token) }}"> {{ $link }} </a>
            </p>

        </div>

    </div>

</body>
</html>
