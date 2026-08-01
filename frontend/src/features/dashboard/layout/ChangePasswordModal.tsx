import Swal from 'sweetalert2'
import { useChangePasswordMutation } from '@/server-action/api/auth.api'

const CHANGE_PASSWORD_MODAL_OPTIONS = {
    background: 'oklch(0.18 0.02 264)',
    color: 'oklch(0.97 0 0)',
    confirmButtonColor: 'oklch(0.72 0.19 142)',
}

const PASSWORD_FIELDS_HTML = `
    <div class="flex flex-col gap-4 text-left p-2">
        <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold text-muted-foreground uppercase">Current Password</label>
            <input type="password" id="old-password" class="swal2-input !m-0 !w-full" placeholder="••••••••">
        </div>
        <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold text-muted-foreground uppercase">New Password</label>
            <input type="password" id="new-password" class="swal2-input !m-0 !w-full" placeholder="••••••••">
        </div>
        <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold text-muted-foreground uppercase">Confirm Password</label>
            <input type="password" id="confirm-password" class="swal2-input !m-0 !w-full" placeholder="••••••••">
        </div>
    </div>
`

const useChangePasswordModal = () => {
    const { mutateAsync } = useChangePasswordMutation()

    const showChangePasswordModal = async () => {
        const result = await Swal.fire({
            title: 'Change Password',
            html: PASSWORD_FIELDS_HTML,
            showCancelButton: true,
            confirmButtonText: 'Update Password',
            focusConfirm: false,
            ...CHANGE_PASSWORD_MODAL_OPTIONS,
            preConfirm: async () => {
                const oldPass = (document.getElementById('old-password') as HTMLInputElement).value
                const newPass = (document.getElementById('new-password') as HTMLInputElement).value
                const confirmPass = (document.getElementById('confirm-password') as HTMLInputElement).value

                if (!oldPass || !newPass || !confirmPass) {
                    Swal.showValidationMessage('Please fill in all fields')
                    return false
                }
                if (newPass !== confirmPass) {
                    Swal.showValidationMessage('Passwords do not match')
                    return false
                }

                try {
                    await mutateAsync({ oldPassword: oldPass, newPassword: newPass })
                } catch (error) {
                    Swal.showValidationMessage(typeof error === 'string' ? error : 'Unable to update password')
                    return false
                }
            },
        })

        if (result.isConfirmed) {
            await Swal.fire({
                title: 'Success!',
                text: 'Your password has been updated.',
                icon: 'success',
                ...CHANGE_PASSWORD_MODAL_OPTIONS,
            })
        }
    }

    return showChangePasswordModal
}

export default useChangePasswordModal
