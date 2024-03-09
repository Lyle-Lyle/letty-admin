// Entry component
import { App } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';
import type { ModalStaticFunctions } from 'antd/es/modal/confirm';
import type { NotificationInstance } from 'antd/es/notification/interface';

/**
 * 因为在函数组件之外不能使用 useApp()hook 所以只能用这种官网的其他方式使用这几个对象
 */

let message: MessageInstance;
let notification: NotificationInstance;
let modal: Omit<ModalStaticFunctions, 'warn'>;

export default () => {
    const staticFunction = App.useApp();
    message = staticFunction.message;
    modal = staticFunction.modal;
    notification = staticFunction.notification;
    return null;
};

export { message, notification, modal };
