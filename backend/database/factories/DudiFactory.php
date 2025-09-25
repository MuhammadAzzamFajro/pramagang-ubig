<?php

namespace Database\Factories;

use App\Models\Dudi;
use Illuminate\Database\Eloquent\Factories\Factory;

class DudiFactory extends Factory
{
    protected $model = Dudi::class;

    public function definition(): array
    {
        return [
            'nama' => $this->faker->company(),
            'alamat' => $this->faker->address(),
            'telepon' => $this->faker->phoneNumber(),
            'email' => $this->faker->unique()->safeEmail(),
        ];
    }
}



