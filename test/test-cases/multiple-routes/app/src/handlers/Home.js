import styles from './Home.less';

import React from 'react';

export default props => (
  <h1 className={styles.root}>Welcome to the Home page bro - {props.site}</h1>
);
