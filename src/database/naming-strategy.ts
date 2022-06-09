import { DefaultNamingStrategy, NamingStrategyInterface, Table } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';

const getTableName = (tableOrName: Table | string): string => {
  const name = tableOrName instanceof Table ? tableOrName.name : tableOrName;
  return name.split('.').pop();
};

export class TypeormSnakeCaseNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface
{
  tableName(className: string, userSpecifiedName: string): string {
    return userSpecifiedName || snakeCase(className) + 's';
  }

  columnName(
    propertyName: string,
    customName: string,
    embeddedPrefixes: string[],
  ): string {
    return (
      snakeCase(embeddedPrefixes.concat('').join('_')) +
      (customName || snakeCase(propertyName))
    );
  }

  relationName(propertyName: string): string {
    return snakeCase(propertyName);
  }

  joinColumnName(relationName: string, referencedColumnName: string): string {
    return snakeCase(`${relationName}_${referencedColumnName}`);
  }

  joinTableName(
    firstTable: string,
    secondTable: string,
    firstProperty: string,
  ): string {
    return snakeCase(
      `${firstTable}_${firstProperty.replace(/\./gi, '_')}_${secondTable}`,
    );
  }

  joinTableColumnName(
    tableName: string,
    propertyName: string,
    columnName?: string,
  ): string {
    return snakeCase(`${tableName}_${columnName || propertyName}`);
  }

  eagerJoinRelationAlias(alias: string, propertyPath: string): string {
    return `${alias}__${propertyPath.replace('.', '_')}`;
  }

  // CONSTRAINTS

  primaryKeyName(tableOrName: Table | string, columnNames: string[]): string {
    const clonedColumnNames = [...columnNames];
    clonedColumnNames.sort();

    const tableName = getTableName(tableOrName);
    return `pk_${tableName}_${clonedColumnNames.join('_')}`;
  }

  uniqueConstraintName(
    tableOrName: Table | string,
    columnNames: string[],
  ): string {
    const clonedColumnNames = [...columnNames];
    clonedColumnNames.sort();

    const tableName = getTableName(tableOrName);
    return `uq_${tableName}_${clonedColumnNames.join('_')}`;
  }

  relationConstraintName(
    tableOrName: Table | string,
    columnNames: string[],
    where?: string,
  ): string {
    const clonedColumnNames = [...columnNames];
    clonedColumnNames.sort();

    const tableName = getTableName(tableOrName);
    let key = `${tableName}_${clonedColumnNames.join('_')}`;

    if (where) {
      key += `_${where}`;
    }

    return `rel_${key}`;
  }

  defaultConstraintName(
    tableOrName: Table | string,
    columnName: string,
  ): string {
    const tableName = getTableName(tableOrName);
    return `df_${tableName}_${columnName}`;
  }

  foreignKeyName(tableOrName: Table | string, columnNames: string[]): string {
    const clonedColumnNames = [...columnNames];
    clonedColumnNames.sort();

    const tableName = getTableName(tableOrName);
    return `fk_${tableName}_${clonedColumnNames.join('_')}`;
  }

  indexName(
    tableOrName: Table | string,
    columnNames: string[],
    where?: string,
  ): string {
    const clonedColumnNames = [...columnNames];
    clonedColumnNames.sort();

    const tableName = getTableName(tableOrName);
    let key = `${tableName}_${clonedColumnNames.join('_')}`;

    if (where) {
      key += `_${where}`;
    }

    return `idx_${key}`;
  }

  checkConstraintName(
    tableOrName: Table | string,
    expression: string,
    isEnum?: boolean,
  ): string {
    const tableName = getTableName(tableOrName);
    const name = `chk_${tableName}_${expression}`;
    return isEnum ? `${name}_enum` : name;
  }

  exclusionConstraintName(
    tableOrName: Table | string,
    expression: string,
  ): string {
    const tableName = getTableName(tableOrName);
    return `xcl_${tableName}_${expression}`;
  }
}
