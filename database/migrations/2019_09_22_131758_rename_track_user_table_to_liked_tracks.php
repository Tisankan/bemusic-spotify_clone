<?php

use App\Models\Track;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RenameTrackUserTableToLikedTracks extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('track_user', function (Blueprint $table) {
            $table->rename('likes');
        });

        Schema::table('likes', function (Blueprint $table) {
            $table->renameColumn('track_id', 'likeable_id');
        });

        Schema::table('likes', function (Blueprint $table) {


            $table->string('likeable_type', 20)->default(addslashes(Track::class))->after('likeable_id');

            $sm = Schema::getConnection()->getDoctrineSchemaManager();
            $indexesFound = $sm->listTableIndexes('likes');
            if (array_key_exists('track_user_track_id_user_id_unique', $indexesFound)) {
                $table->dropIndex('track_user_track_id_user_id_unique');
            }

            $table->unique(['likeable_id', 'likeable_type', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('likes', function (Blueprint $table) {
            $table->rename('track_user');
        });
    }
}
