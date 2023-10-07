<x-guest-layout>
    <form method="POST" action="{{ route('register') }}">
        @csrf

         <!-- MAtricula -->
         <div>
            <x-input-label for="matricula" :value="__('Matricula')" />
            <x-text-input id="matricula" class="block mt-1 w-full" type="text" name="matricula" :value="old('matricula')" required autofocus autocomplete="name" />
            <x-input-error :messages="$errors->get('matricula')" class="mt-2" />
        </div>

        <!-- Name -->
        <div>
            <x-input-label for="name" :value="__('Name')" />
            <x-text-input id="name" class="block mt-1 w-full" type="text" name="name" :value="old('name')" required autofocus autocomplete="name" />
            <x-input-error :messages="$errors->get('name')" class="mt-2" />
        </div>

        <!-- LastName -->
        <div>
            <x-input-label for="lastname" :value="__('Lastname')" />
            <x-text-input id="lastname" class="block mt-1 w-full" type="text" name="lastname" :value="old('lastname')" required autofocus autocomplete="name" />
            <x-input-error :messages="$errors->get('lastname')" class="mt-2" />
        </div>

        <!-- Campus -->
        <div class="mt-4">
            <x-input-label for="campus" :value="__('Campus')" />
            <x-text-input id="campus" class="block mt-1 w-full" type="campus" name="campus" :value="old('campus')" required autocomplete="username" />
            <x-input-error :messages="$errors->get('campus')" class="mt-2" />
        </div>

        <!-- Facultad -->
        <div class="mt-4">
            <x-input-label for="facultad" :value="__('Facultad')" />
            <x-text-input id="facultad" class="block mt-1 w-full" type="facultad" name="facultad" :value="old('facultadl')" required autocomplete="username" />
            <x-input-error :messages="$errors->get('facultad')" class="mt-2" />
        </div>

        <!-- Email Address -->
        <div class="mt-4">
            <x-input-label for="email" :value="__('Email')" />
            <x-text-input id="email" class="block mt-1 w-full" type="email" name="email" :value="old('email')" required autocomplete="username" />
            <x-input-error :messages="$errors->get('email')" class="mt-2" />
        </div>

        <!-- Password -->
        <div class="mt-4">
            <x-input-label for="password" :value="__('Password')" />

            <x-text-input id="password" class="block mt-1 w-full"
                            type="password"
                            name="password"
                            required autocomplete="new-password" />

            <x-input-error :messages="$errors->get('password')" class="mt-2" />
        </div>

        <!-- Confirm Password -->
        <div class="mt-4">
            <x-input-label for="password_confirmation" :value="__('Confirm Password')" />

            <x-text-input id="password_confirmation" class="block mt-1 w-full"
                            type="password"
                            name="password_confirmation" required autocomplete="new-password" />

            <x-input-error :messages="$errors->get('password_confirmation')" class="mt-2" />
        </div>

        <div class="flex items-center justify-end mt-4">
            <a class="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" href="{{ route('login') }}">
                {{ __('Already registered?') }}
            </a>

            <x-primary-button class="ml-4">
                {{ __('Register') }}
            </x-primary-button>
        </div>
    </form>
</x-guest-layout>
