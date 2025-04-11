import { Country } from "src/shared/types";

interface Props {
    country: Country;
}

const AttributesTab = ({ country }: Props) => {
    return (
        <section className="flex flex-col gap-3">
            <div className="flex gap-3">
                <div className="flex-1">
                    <p className="mb-1 text-xs font-medium text-muted-foreground">Flag</p>
                    <div className="overflow-hidden rounded-md border border-border">
                        <img
                            src={country.flag}
                            alt={`Flag of ${country.name.common}`}
                            className="h-32 w-full object-cover"
                        />
                    </div>
                </div>

                <div className="flex-1">
                    <p className="mb-1 text-xs font-medium text-muted-foreground">Coat of Arms</p>
                    <div className="aspect-square h-32 overflow-hidden rounded-md border border-border bg-muted/50">
                        {country.coatOfArms && (
                            <img
                                src={country.coatOfArms}
                                alt={`Coat of Arms of ${country.name.common}`}
                                className="size-full object-contain"
                            />
                        )}
                    </div>
                </div>
            </div>

            {country.anthem && (
                <div>
                    <p className="text-xs font-medium text-muted-foreground">National Anthem: {country.anthem.name}</p>
                    <audio controls className="mt-1 w-full" key={country.anthem.url}>
                        <source src={country.anthem.url} />
                    </audio>
                </div>
            )}
        </section>
    );
};
export default AttributesTab;
