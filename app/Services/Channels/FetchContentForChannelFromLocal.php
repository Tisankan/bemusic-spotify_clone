<?php

namespace App\Services\Channels;

use App\Models\Album;
use App\Models\Genre;
use App\Models\Track;
use App\Services\Tracks\Queries\PlaylistTrackQuery;
use Illuminate\Support\Collection;

class FetchContentForChannelFromLocal
{
    public function execute(
        string $method,
        mixed $value,
        ?array $filters = [],
    ): Collection|null {
        return match ($method) {
            'topTracks' => $this->topTracks($filters),
            'newAlbums' => $this->newAlbums($filters),
            'playlistTracks' => $this->playlistTracks($value),
            'topGenres' => Genre::orderBy('popularity', 'desc')
                ->limit(20)
                ->get(),
            default => null,
        };
    }

    protected function topTracks(?array $filters = [])
    {
        if (isset($filters['genre'])) {
            $genre = Genre::find($filters['genre']);
            return $genre
                ? $genre
                    ->tracks()
                    ->orderByPopularity()
                    ->limit(20)
                    ->get()
                : collect();
        }

        return Track::orderByPopularity()
            ->limit(20)
            ->get();
    }

    protected function newAlbums(?array $filters = [])
    {
        if (isset($filters['genre'])) {
            $genre = Genre::find($filters['genre']);
            return $genre
                ? $genre
                    ->albums()
                    ->orderBy('release_date', 'desc')
                    ->limit(20)
                    ->get()
                : collect();
        }

        return Album::orderBy('release_date', 'desc')
            ->limit(20)
            ->get();
    }

    protected function playlistTracks(int $id)
    {
        $query = (new PlaylistTrackQuery([
            'orderBy' => 'position',
            'orderDir' => 'asc',
        ]))->get($id);

        return $query->limit(20)->get();
    }
}
