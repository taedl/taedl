package io.taedl.api.services;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import io.taedl.api.dto.*;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
public class RdQueryBuildingServiceTest {

    @Autowired
    QueryBuildingService queryBuildingService;

    @Test
    public void contextLoads() {
    }

    @Test
    public void testGeneratePreviewQuery() {

        List<TableMetaData> tables = ImmutableList.of(
                new TableMetaData(
                        "bonuses",
                        new Column("id", "bonuses", null, null),
                        ImmutableList.of(
                                ImmutableMap.<String, Column>builder().put("primary", new Column("id", "users", null, null)).build(),
                                ImmutableMap.<String, Column>builder().put("foreign", new Column("user_id", "bonuses", null, null)).build()
                        ),
                        Collections.emptyList(),
                        ImmutableList.of(
                                new Column("id", "bonuses", null, null),
                                new Column("amount", "bonuses", null, null),
                                new Column("bonusdate", "bonuses", null, null),
                                new Column("user_id", "bonuses", null, null)
                        )
                ),
                new TableMetaData(
                        "cities",
                        new Column("id", "cities", null, null),
                        ImmutableList.of(
                                ImmutableMap.<String, Column>builder().put("primary", new Column("id", "states", null, null)).build(),
                                ImmutableMap.<String, Column>builder().put("foreign", new Column("state_id", "cities", null, null)).build()
                        ),
                        ImmutableList.of(
                                ImmutableMap.<String, Column>builder().put("primary", new Column("id", "cities", null, null)).build(),
                                ImmutableMap.<String, Column>builder().put("foreign", new Column("city_id", "transactions", null, null)).build()
                        ),
                        ImmutableList.of(
                                new Column("id", "cities", null, null),
                                new Column("name", "cities", null, null),
                                new Column("state_id", "cities", null, null)
                        )
                ),
                new TableMetaData(
                        "companies",
                        new Column("id", "companies", null, null),
                        Collections.emptyList(),
                        ImmutableList.of(
                                ImmutableMap.<String, Column>builder().put("primary", new Column("id", "companies", null, null)).build(),
                                ImmutableMap.<String, Column>builder().put("foreign", new Column("company_id", "users", null, null)).build()
                        ),
                        ImmutableList.of(
                                new Column("id", "companies", null, null),
                                new Column("name", "companies", null, null)
                        )
                )
        );

        List<Join> joins = ImmutableList.of(
                new Join(new Column("id", "cities", null, null), new Column("city_id", "transactions", null, null), JoinType.inner),
                new Join(new Column("id", "companies", null, null), new Column("company_id", "users", null, null), JoinType.inner),
                new Join(new Column("id", "states", null, null), new Column("state_id", "cities", null, null), JoinType.inner),
                new Join(new Column("id", "users", null, null), new Column("user_id", "bonuses", null, null), JoinType.inner),
                new Join(new Column("id", "users", null, null), new Column("user_id", "hobbies", null, null), JoinType.inner),
                new Join(new Column("id", "users", null, null), new Column("user_id", "pay", null, null), JoinType.inner),
                new Join(new Column("id", "users", null, null), new Column("user_id", "transactions", null, null), JoinType.inner),
                new Join(new Column("city_id", "transactions", null, null), new Column("id", "cities", null, null), JoinType.inner),
                new Join(new Column("company_id", "users", null, null), new Column("id", "companies", null, null), JoinType.inner),
                new Join(new Column("state_id", "cities", null, null), new Column("id", "states", null, null), JoinType.inner),
                new Join(new Column("user_id", "bonuses", null, null), new Column("id", "users", null, null), JoinType.inner),
                new Join(new Column("user_id", "hobbies", null, null), new Column("id", "users", null, null), JoinType.inner),
                new Join(new Column("user_id", "pay", null, null), new Column("id", "users", null, null), JoinType.inner),
                new Join(new Column("user_id", "transactions", null, null), new Column("id", "users", null, null), JoinType.inner)
        );
        String vendor = "postgresql";

        assertThat(queryBuildingService.generatePreviewQuery(tables, joins, vendor))
                .isEqualTo("select bonuses.id, bonuses.amount, bonuses.bonusdate, bonuses.user_id, cities.id, cities.name, cities.state_id, companies.id, companies.name from bonuses inner join users on bonuses.user_id = users.id inner join transactions on users.id = transactions.user_id inner join cities on transactions.city_id = cities.id inner join companies on users.company_id = companies.id limit 100;");
    }

    @Test
    public void testGenerateTableQueryAggregationWithFilters() {

        List<TableMetaData> tables = ImmutableList.of(
                new TableMetaData(
                        "bonuses",
                        new Column("id", "bonuses", null, null),
                        ImmutableList.of(
                                ImmutableMap.<String, Column>builder().put("primary", new Column("id", "users", null, null))
                                .put("foreign", new Column("user_id", "bonuses", null, null)).build()
                        ),
                        Collections.emptyList(),
                        ImmutableList.of(
                                new Column("id", "bonuses", null, null),
                                new Column("amount", "bonuses", null, null),
                                new Column("bonusdate", "bonuses", null, null),
                                new Column("user_id", "bonuses", null, null)
                        )
                ),
                new TableMetaData(
                        "cities",
                        new Column("id", "cities", null, null),
                        ImmutableList.of(
                                ImmutableMap.<String, Column>builder().put("primary", new Column("id", "states", null, null))
                                .put("foreign", new Column("state_id", "cities", null, null)).build()
                        ),
                        ImmutableList.of(
                                ImmutableMap.<String, Column>builder().put("primary", new Column("id", "cities", null, null))
                                .put("foreign", new Column("city_id", "transactions", null, null)).build()
                        ),
                        ImmutableList.of(
                                new Column("id", "cities", null, null),
                                new Column("name", "cities", null, null),
                                new Column("state_id", "cities", null, null)
                        )
                ),
                new TableMetaData(
                        "companies",
                        new Column("id", "companies", null, null),
                        Collections.emptyList(),
                        ImmutableList.of(
                                ImmutableMap.<String, Column>builder().put("primary", new Column("id", "companies", null, null))
                                .put("foreign", new Column("company_id", "users", null, null)).build()
                        ),
                        ImmutableList.of(
                                new Column("id", "companies", null, null),
                                new Column("name", "companies", null, null)
                        )
                ),
                new TableMetaData(
                        "hobbies",
                        new Column("id", "hobbies", null, null),
                        ImmutableList.of(
                                ImmutableMap.<String, Column>builder().put("primary", new Column("id", "users", null, null))
                                .put("foreign", new Column("user_id", "hobbies", null, null)).build()
                        ),
                        Collections.emptyList(),
                        ImmutableList.of(
                                new Column("id", "hobbies", null, null),
                                new Column("name", "hobbies", null, null),
                                new Column("user_id", "hobbies", null, null)
                        )
                ),
                new TableMetaData(
                        "pay",
                        new Column("id", "pay", null, null),
                        ImmutableList.of(
                                ImmutableMap.<String, Column>builder().put("primary", new Column("id", "users", null, null))
                                .put("foreign", new Column("user_id", "pay", null, null)).build()
                        ),
                        Collections.emptyList(),
                        ImmutableList.of(
                                new Column("id", "pay", null, null),
                                new Column("amount", "pay", null, null),
                                new Column("user_id", "pay", null, null)
                        )
                ),
                new TableMetaData(
                        "states",
                        new Column("id", "states", null, null),
                        Collections.emptyList(),
                        ImmutableList.of(
                                ImmutableMap.<String, Column>builder().put("primary", new Column("id", "states", null, null))
                                .put("foreign", new Column("state_id", "cities", null, null)).build()
                        ),
                        ImmutableList.of(
                                new Column("id", "states", null, null),
                                new Column("name", "states", null, null)
                        )
                ),
                new TableMetaData(
                        "transactions",
                        new Column("id", "transactions", null, null),
                        ImmutableList.of(
                                ImmutableMap.<String, Column>builder().put("primary", new Column("id", "cities", null, null))
                                        .put("foreign", new Column("city_id", "transactions", null, null)).build(),
                                ImmutableMap.<String, Column>builder().put("primary", new Column("id", "users", null, null))
                                        .put("foreign", new Column("user_id", "transactions", null, null)).build()
                        ),
                        Collections.emptyList(),
                        ImmutableList.of(
                                new Column("id", "transactions", null, null),
                                new Column("amount", "transactions", null, null),
                                new Column("transactiondate", "transactions", null, null),
                                new Column("user_id", "transactions", null, null),
                                new Column("users", "transactions", null, null)
                        )
                ),
                new TableMetaData(
                        "users",
                        new Column("id", "users", null, null),
                        ImmutableList.of(
                                ImmutableMap.<String, Column>builder().put("primary", new Column("id", "companies", null, null))
                                .put("foreign", new Column("company_id", "users", null, null)).build()

                        ),
                        ImmutableList.of(
                                ImmutableMap.<String, Column>builder().put("primary", new Column("id", "users", null, null))
                                        .put("foreign", new Column("user_id", "bonuses", null, null)).build(),

                                ImmutableMap.<String, Column>builder().put("primary", new Column("id", "users", null, null))
                                        .put("foreign", new Column("user_id", "hobbies", null, null)).build(),

                                ImmutableMap.<String, Column>builder().put("primary", new Column("id", "users", null, null))
                                        .put("foreign", new Column("user_id", "pay", null, null)).build(),

                                ImmutableMap.<String, Column>builder().put("primary", new Column("id", "users", null, null))
                                        .put("foreign", new Column("user_id", "transactions", null, null)).build()
                        ),
                        ImmutableList.of(
                                new Column("id", "companies", null, null),
                                new Column("name", "companies", null, null)
                        )
                )
        );

        List<Column> columns = ImmutableList.of(
                new Column("name", "cities", null, null),
                new Column("user_id", "bonuses", null, null)
        );

        List<AggregatedColumn> rows = ImmutableList.of(new AggregatedColumn(new Column("amount", "bonuses", null, null), Aggregation.COUNT));

        List<Join> joins = ImmutableList.of(
                new Join(new Column("id", "cities", null, null), new Column("city_id", "transactions", null, null), JoinType.inner),
                new Join(new Column("id", "companies", null, null), new Column("company_id", "users", null, null), JoinType.inner),
                new Join(new Column("id", "states", null, null), new Column("state_id", "cities", null, null), JoinType.inner),
                new Join(new Column("id", "users", null, null), new Column("user_id", "bonuses", null, null), JoinType.inner),
                new Join(new Column("id", "users", null, null), new Column("user_id", "hobbies", null, null), JoinType.inner),
                new Join(new Column("id", "users", null, null), new Column("user_id", "pay", null, null), JoinType.inner),
                new Join(new Column("id", "users", null, null), new Column("user_id", "transactions", null, null), JoinType.inner),
                new Join(new Column("city_id", "transactions", null, null), new Column("id", "cities", null, null), JoinType.inner),
                new Join(new Column("company_id", "users", null, null), new Column("id", "companies", null, null), JoinType.inner),
                new Join(new Column("state_id", "cities", null, null), new Column("id", "states", null, null), JoinType.inner),
                new Join(new Column("user_id", "bonuses", null, null), new Column("id", "users", null, null), JoinType.inner),
                new Join(new Column("user_id", "hobbies", null, null), new Column("id", "users", null, null), JoinType.inner),
                new Join(new Column("user_id", "pay", null, null), new Column("id", "users", null, null), JoinType.inner),
                new Join(new Column("user_id", "transactions", null, null), new Column("id", "users", null, null), JoinType.inner)
        );

        List<Filter> filters = ImmutableList.of(new Filter(new Column("bonusdate", "bonuses", "date", "13"),
                FilterCondition.DATE_GREATER_OR_EQUAL, "2018-01-01"));

        String vendor = "postgresql";

        assertThat(queryBuildingService.generateTableQuery(tables, columns, rows, joins, filters, vendor))
                .isEqualTo("select cities.name, bonuses.user_id, count(bonuses.amount) as count$$$bonuses$$$amount$$$ from bonuses inner join users on bonuses.user_id = users.id inner join transactions on users.id = transactions.user_id inner join cities on transactions.city_id = cities.id where bonuses.bonusdate >= '2018-01-01' group by cities.name, bonuses.user_id order by cities.name, bonuses.user_id, count$$$bonuses$$$amount$$$ desc limit 5000;");
    }
}
