<?php
namespace App\Http\Traits;

use Carbon\Carbon;

Trait GlobalTrait
{

    // FUNCION PARA QUITAR CARACTERES LOCOS DE UN STRING
    static function eliminarCaracteresEspecialeString($string)
    {

       $string = trim($string);
       $string = str_replace(
           array('á', 'à', 'ä', 'â', 'ª', 'Á', 'À', 'Â', 'Ä'),
           array('a', 'a', 'a', 'a', 'a', 'A', 'A', 'A', 'A'),
           $string
       );

       $string = str_replace(
           array('é', 'è', 'ë', 'ê', 'É', 'È', 'Ê', 'Ë'),
           array('e', 'e', 'e', 'e', 'E', 'E', 'E', 'E'),
           $string
       );

       $string = str_replace(
           array('í', 'ì', 'ï', 'î', 'Í', 'Ì', 'Ï', 'Î'),
           array('i', 'i', 'i', 'i', 'I', 'I', 'I', 'I'),
           $string
       );

       $string = str_replace(
           array('ó', 'ò', 'ö', 'ô', 'Ó', 'Ò', 'Ö', 'Ô'),
           array('o', 'o', 'o', 'o', 'O', 'O', 'O', 'O'),
           $string
       );

       $string = str_replace(
           array('ú', 'ù', 'ü', 'û', 'Ú', 'Ù', 'Û', 'Ü'),
           array('u', 'u', 'u', 'u', 'U', 'U', 'U', 'U'),
           $string
       );

       $string = str_replace(
           array('ñ', 'Ñ', 'ç', 'Ç'),
           array('n', 'N', 'c', 'C',),
           $string
       );

       return $string;

    }

    // FUNCION PARA VERIFICAR DE UNA FECHA SI ES FIN DE SEMANA, SI CAE SE SUMA UN DIA HASTA LLEGAR AUN DIA DE SEMANA
    static function verificarFinesDeSemanaSuma($date)
    {

      $date= Carbon::parse($date);
      if ($date->isWeekend()) {

        while ($date->isWeekend()) {
          $date->day++;
        }
        return $date->format('Y-m-d');

      }else{

          return $date->format('Y-m-d');

      }

    }

    // FUNCION PARA VERIFICAR DE UNA FECHA SI ES FIN DE SEMANA, SI CAE SE RESTA UN DIA HASTA LLEGAR AUN DIA DE SEMANA
    static function verificarFinesDeSemanaResta($date)
    {

      $date= Carbon::parse($date);
      if ($date->isWeekend()) {

        while ($date->isWeekend()) {
          $date->day--;
        }
        return $date->format('Y-m-d');

      }else{

          return $date->format('Y-m-d');

      }

    }

}
