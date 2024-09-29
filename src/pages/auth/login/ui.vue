<template>
    <div class="flex justify-center items-center">
        <Card>
            <template #content>
                <div class="  w-full sm:w-80 flex flex-col  gap-4">
                    <h2 class=" text-center text-2xl">LogIn</h2>
                    <form class="flex gap-2 flex-col" @submit.prevent="onSubmit">
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-user" />
                            </InputIcon>
                            <InputText :disabled="isLoading" id="input" v-model="username" type="text" placeholder="Name" autofocus fluid />
                        </IconField>
                        <small class="text-red-500">{{ errors.username }}</small>

                        <InputGroup>
                            <Password :disabled="isLoading" v-model="password" :feedback="false" toggleMask inputId="password"
                                placeholder="Password" />
                        </InputGroup>
                        <small class="text-red-500">{{ errors.password }}</small>

                        <div class="flex items-center gap-2">
                            <Checkbox inputId="accept" v-model="save" :binary="true" />
                            <label class="select-none" for="accept">Remember me</label>
                        </div>
                        <Button label="LogIn" type="submit" :loading="isLoading" :disabled="isLoading" />
                    </form>
                    <Button label="Create account?" icon="pi pi-user-plus" iconPos="right" size="small" link
                        to="/signUp" as="router-link" class="flex self-start" />
                </div>
            </template>

        </Card>
    </div>
</template>

<script setup lang="ts">
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import { useForm } from "vee-validate";
import * as yup from "yup";
import Password from "primevue/password";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import InputGroup from "primevue/inputgroup";
import InputText from "primevue/inputtext";
import { useAuthStore } from "../../../entities/auth/model/store";
import { LoginType } from "../../../entities/auth/type/auth";
import { ref } from "vue";
import Card from 'primevue/card';

const authStore = useAuthStore();
const isLoading = ref(false);

const schema = yup.object({
    username: yup.string().required().min(3).max(16).label("Username"),
    password: yup.string().required().min(6).label("Password"),
    save: yup.boolean().optional().default(false).label("Remember me"),
});
const { defineField, handleSubmit, errors } = useForm({
    validationSchema: schema,
});

const [username] = defineField("username");
const [password] = defineField("password");
const [save] = defineField("save");


const onSubmit = handleSubmit(async (values) => {
    isLoading.value = true;
    const loginData: LoginType = {
        username: values.username,
        password: values.password,
        remember_me: values.save ?? false
    };
    await authStore.authLogin(loginData);

    isLoading.value = false;

});
</script>
