<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class statusNotification extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $medicion;
    public $nombreIOT;
    public $nombreVariable;
    public $resultado;
    public $asunto; 
    public $medicion2;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($medicion, $nombreIOT, $nombreVariable, $resultado,$asunto,$medicion2)
    {
        $this->medicion = $medicion;
        $this->nombreIOT = $nombreIOT;
        $this->nombreVariable = $nombreVariable;
        $this->resultado = $resultado;
        $this->asunto = $asunto;
        $this->medicion2 = $medicion2;        
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {  
        return $this->from('iotwarnings@notification.net')
                    ->subject($this->asunto)
                    ->view('emails.statusWarning');

    }
}
