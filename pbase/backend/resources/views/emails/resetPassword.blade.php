Hola {{$user->name}}

Se ha solicitado un cambio de contraseña, por favor siga el siguiente vínculo para poder restablecerla:


{{Route('password.reset',$user->verification_token)}}


De no ser usted el que solicitó el cambio, ignore éste mensaje.



COMMLOGIK APP 