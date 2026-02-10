import Swal from 'sweetalert2';

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});

export const alertService = {
    // สำหรับแจ้งเตือนความสำเร็จแบบ Pop-up กลางจอ
    success: (title: string, text?: string) => {
        return Swal.fire({
            icon: 'success',
            title,
            text,
            confirmButtonColor: '#3b82f6', // สี Blue-500 แบบ Tailwind
            // borderRadius: '15px'
        });
    },

    // สำหรับแจ้งเตือนความผิดพลาด
    error: (title: string, text?: string) => {
        return Swal.fire({
            icon: 'error',
            title,
            text,
            confirmButtonColor: '#ef4444'
        });
    },

    // สำหรับยืนยันการลบ (สวยกว่า confirm ปกติ)
    confirmDelete: (title: string, text: string) => {
        return Swal.fire({
            title,
            text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'ใช่, ลบเลย!',
            cancelButtonText: 'ยกเลิก',
            reverseButtons: true
        });
    },

    // สำหรับแจ้งเตือนแบบมุมจอ (Toast)
    notify: (title: string) => {
        Toast.fire({
            icon: 'success',
            title
        });
    }
};