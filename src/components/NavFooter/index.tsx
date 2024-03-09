import styles from './index.module.less';

export default function NavFooter() {
    return (
        <div className={styles.footer}>
            <div>
                <a href="" target="_blank" rel="noreferrer">
                    Join us
                </a>
                <span className="gutter">|</span>
                <a href="">Letty</a>
            </div>
            <div>Copyright @{new Date().getFullYear()} All Rights Reserved</div>
        </div>
    );
}
