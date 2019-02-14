@if (count($errors) > 0)
<div class="alert alert-danger" role="alert">
	<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
	<ul>
		@foreach ($errors->all() as $error)
			<li><strong>{{$error}}</strong></li>
		@endforeach
	</ul>
</div>
@endif
