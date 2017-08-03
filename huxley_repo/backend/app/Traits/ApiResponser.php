<?php


namespace App\Traits;


use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Validator;
use Illuminate\Pagination\LengthAwarePaginator;

trait ApiResponser
{
	private function successResponse($data, $code)
	{
		return response()->json($data, $code);
	}

	protected function errorResponse($message, $code)
	{
		return response()->json(['error' => $message, 'code' => $code], $code);
	}

	protected function showAll(Collection $collection, $code = 200)
	{

		if ($collection->isEmpty()) {
			return $this->successResponse(['data' => $collection],$code);
		}

		$transformer = $collection->first()->transformer;
		//desactive el filtro igual por la consulta like que esta en user controller para qe no se pisen.
		//para usar el filter de nuevo hay que descomentarlo, esto va a hacer conflicto con el filtro del controlador, por
		//lo que es recomendado dejarlo asi comentado a menos que haya que debuguear algo del filtro "like" que se hace
		//directamente sobre la consulta y no sobre el resultado
		//$collection = $this->filterData($collection, $transformer);
		$collection = $this->sortData($collection, $transformer);
		$collection = $this->paginate($collection);
		$collection = $this->transformData($collection, $transformer);
		//$collection = $this->cacheResponse($collection);

		return $this->successResponse($collection, $code);

	}
	protected function showAllNouser(Collection $collection, $code = 200)
	{

		if ($collection->isEmpty()) {
			return $this->successResponse(['data' => $collection],$code);
		}
		$collection = $this->sortDataNoUser($collection);
		
		$collection = $this->paginate($collection);
		//$collection = $this->cacheResponse($collection);

		return $this->successResponse($collection, $code);

	}

	protected function showOne(Model $instance, $code = 200)
	{
		$transformer = $instance->transformer;
		$instance = $this->transformData($instance, $transformer);
		return $this->successResponse($instance, $code);
	}

	protected function showMessage($message, $code = 200)
	{
		return $this->successResponse($message, $code);
	}

	protected function filterData(Collection $collection, $transformer)
	{
		//DESACTIVADO-> VER COMENTARIO EN $this->showAll()
		foreach (request()->query() as $query => $value) {
			$attribute = $transformer::originalAttribute($query);

			if (isset($attribute, $value)) {
				$collection = $collection->where($attribute,$value);
			}
		}

		return $collection;

	}

	protected function paginate(Collection $collection)
	{
		$rules = [
			'per_page' => 'integer|min:2|max:50'
		];

		Validator::validate(request()->all(), $rules);
		$page = LengthAwarePaginator::resolveCurrentPage();

		$perPage = 10;

		if (request()->has('per_page')) {
			$perPage = (int) request()->per_page;
		}
		$results = $collection->slice(($page - 1) * $perPage, $perPage)->values();
		$paginated = new LengthAwarePaginator($results, $collection->count(), $perPage, $page, [
			'path' => LengthAwarePaginator::resolveCurrentPath(),
		]);
		$paginated->appends(request()->all());
		return $paginated;
	}

	protected function sortData(Collection $collection, $transformer)
	{
		if (request()->has('sort_by')) {
			$attribute = $transformer::originalAttribute(request()->sort_by);

			$collection = $collection ->sortBy($attribute, SORT_NATURAL|SORT_FLAG_CASE);
		}elseif (request()->has('sort_by_desc')) {
			$attribute = $transformer::originalAttribute(request()->sort_by_desc);

			$collection = $collection ->sortByDesc($attribute, SORT_NATURAL|SORT_FLAG_CASE);

		}
		return $collection;
	}
	protected function sortDataNoUser(Collection $collection)
	{
		if (request()->has('sort_by')) {
			$collection = $collection ->sortBy(request()->sort_by, SORT_NATURAL|SORT_FLAG_CASE);
		}elseif (request()->has('sort_by_desc')) {
			$collection = $collection ->sortByDesc(request()->sort_by_desc, SORT_NATURAL|SORT_FLAG_CASE);
		}
		return $collection;
	}

	protected function transformData($data, $transformer)
	{
	$transformation = fractal($data, new $transformer);
	return $transformation->toArray();
	}

	protected function cacheResponse($data)
	{
		$url = request()->url();

		$queryParams = request()->query();

		ksort($queryParams);

		$queryString = http_build_query($queryParams);

		$fullUrl = "{$url}?{$queryString}";

		return Cache::remember($fullUrl, 30/60, function() use($data) {
			return $data;
		});
	}

}
