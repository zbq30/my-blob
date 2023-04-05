import type { NextPage } from "next"
import styles from './index.module.scss';

const Footer: NextPage = () => {
  return (
    <div className={styles.footer}>
      <p>---My-Blog---</p>
    </div>
  );
}

export default Footer