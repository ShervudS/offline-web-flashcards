import styles from "./styles.module.scss";

import { ICON_NAME } from "./types";

type TSVGIcon = {
  name: ICON_NAME;
};

export const SVGIcon = ({ name }: TSVGIcon) => (
  <i
    className={styles.icon}
    style={{
      maskImage: `url(${import.meta.env.BASE_URL}/images/${name}.svg)`,
    }}
  />
);
