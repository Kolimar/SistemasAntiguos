@extends('index')

@section('titulo','Cambiar contraseña')

@section('content')

<div class="container" style="padding:5%;background-color:#364150">

  @include('errors/errores')
  @include('flash::message')

  <br>

  <div style="background-color:#fff;padding:30px">

    <h3>Cambiar de contraseña</h3>

    <hr>

    <form method="POST" action="{{ url('password/reset').'?token='.$token }}">
      {{ csrf_field() }}

      <div class="form-group{{ $errors->has('new_password') ? ' has-error' : '' }}">
        {!! Form::label('new_password', 'Nueva contraseña') !!}
        {!! Form::password('new_password', ['class' => 'form-control']) !!}
      </div>

      <div class="form-group{{ $errors->has('password_confirmation') ? ' has-error' : '' }}">
        {!! Form::label('password_confirmation', 'Repetir Contraseña') !!}
        {!! Form::password('password_confirmation', ['class' => 'form-control']) !!}
      </div>

      <hr>

      <div class="form-group">
        <button type="submit" class="btn btn-primary">
          <i class="fa fa-unlock" aria-hidden="true"></i> Cambiar
        </button>
      </div>

    </form>

  </div>


</div>

@endsection
