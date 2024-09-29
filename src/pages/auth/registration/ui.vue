<template>
    <div class="flex justify-center items-center">
        <Card>
            <template #content>
                <div class=" w-full sm:w-80 flex flex-col gap-4 ">
                    <h2 class=" text-center text-2xl">SignUp</h2>
                    <form class="flex gap-2 flex-col" @submit.prevent="onSubmit">
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-user" />
                            </InputIcon>
                            <InputText v-model="username" :invalid="!!errors.username" id="input" type="text"
                                placeholder="Name" autofocus fluid />
                        </IconField>
                        <small class="text-red-500">{{ errors.username }}</small>
                        <InputGroup>
                            <Password v-model="password" :invalid="!!errors.password" :feedback="false" toggleMask
                                inputId="password" placeholder="Password" />
                        </InputGroup>
                        <small class="text-red-500">{{ errors.password }}</small>
                        <InputGroup>
                            <Password v-model="passwordConfirm" :invalid="!!errors.passwordConfirm" :feedback="false"
                                toggleMask inputId="passwordConfirm" auto placeholder="Repeat password" />
                        </InputGroup>
                        <small class="text-red-500">{{ errors.passwordConfirm }}</small>
                        <Button icon="" label="Submit" type="submit" :loading="loading" :disabled="loading" />
                    </form>

                    <Button label="LogIn" iconPos="right" icon="pi pi-sign-in" size="small" link to="/login"
                        as="router-link" class="flex self-start" />
                </div>
            </template>
        </Card>

    </div>
</template>

<script setup lang="ts">

import IconField from 'primevue/iconfield'
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import InputIcon from 'primevue/inputicon'
import Password from 'primevue/password';
import Button from 'primevue/button';
import InputGroup from 'primevue/inputgroup';
import InputText from 'primevue/inputtext';
import { useAuthStore } from '../../../entities/auth/model/store';
import Card from 'primevue/card';
import { RegistrationType } from '../../../entities/auth/type/auth';

import { ref } from 'vue';
const authStore = useAuthStore()
const schema = yup.object({
    username: yup.string().required().label("Username").min(3).max(16),
    password: yup.string().required().min(6).label("Password"),
    passwordConfirm: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required()
        .label('Password confirmation'),

})
const { defineField, handleSubmit, errors } = useForm({
    validationSchema: schema,
});

const loading = ref(false)


const [username] = defineField('username');
const [password] = defineField('password');
const [passwordConfirm] = defineField('passwordConfirm');
const onSubmit = handleSubmit(async (values) => {

    loading.value = true;
    const registrationData: RegistrationType = {
        username: values.username,
        password: values.password,
        password_again: values.passwordConfirm,
    };
    await authStore.authSignup(registrationData);

    loading.value = false;

});
</script>